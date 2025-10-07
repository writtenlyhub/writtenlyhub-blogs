import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Facebook, Linkedin, Share2, Instagram, Youtube } from "lucide-react";
import "./../../components/blog/BlogDetailContent.css";
import BlogCard from "../../components/blog/BlogCard";
import TOC from "../../components/blog/TOC";
import FaqBlock from "../../components/blog/FaqBlock";
import wpAPI from "../../utils/api";
import NewsletterSubscribe from "../../components/blog/NewsletterSubscribe";
import ContentForm from "./ContentForm";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryNames, setCategoryNames] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const contentRef = useRef(null);
  const publishedBlockRef = useRef(null);

  // Calculate reading time
  const calculateReadingTime = text => {
    if (!text) return "1 min read";

    const cleanText = text.replace(/<[^>]*>/g, "");
    const wordCount = cleanText.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return `${readingTime} min read`;
  };

  // Text-to-speech handler
  const handleTextToSpeech = text => {
    if (!text) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/<[^>]*>/g, "");

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = 1.0;

      window.speechSynthesis.cancel();

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert("Text-to-speech is not supported in your browser");
    }
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Extract FAQs from HTML content
  const extractAndRemoveFaqs = html => {
    if (!html) return { content: html, faqs: [] };

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const faqElements = tempDiv.querySelectorAll(".wp-block-faq");
    const extractedFaqs = Array.from(faqElements).map(el => {
      el.parentNode.removeChild(el);
      return {
        q: el.querySelector(".faq-question")?.textContent || "",
        a: el.querySelector(".faq-answer")?.innerHTML || "",
      };
    });

    return { content: tempDiv.innerHTML, faqs: extractedFaqs };
  };

  // Process WordPress HTML content
  const processContent = html => {
    if (!html) return html;

    let processed = html
      .replace(/wp-block-columns/g, "columns flex flex-wrap -mx-2")
      .replace(/wp-block-column/g, "column px-2")
      .replace(/wp-block-image/g, "image-block relative")
      .replace(/wp-block-button/g, "button-block");

    processed = processed.replace(/style="[^"]*"/g, "");

    processed = processed.replace(
      /<table/g,
      '<div class="overflow-x-auto"><table class="min-w-full"'
    );
    processed = processed.replace(/<\/table>/g, "</table></div>");

    return processed;
  };

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const postData = await wpAPI.getPostBySlug(slug);

        if (!postData) {
          setError("Post not found");
          return;
        }

        let processedContent = postData.content?.rendered || "";
        let extractedFaqs = [];

        if (postData.content?.rendered) {
          const result = extractAndRemoveFaqs(postData.content.rendered);
          processedContent = result.content;
          extractedFaqs = result.faqs;
        }

        setPost({
          ...postData,
          content: {
            ...postData.content,
            rendered: processedContent,
          },
        });

        setFaqs(extractedFaqs);

        if (postData.categories?.length > 0) {
          try {
            const categories = await wpAPI.getCategories();
            const names = postData.categories
              .map(id => categories.find(cat => cat.id === id)?.name)
              .filter(Boolean);
            setCategoryNames(names);
          } catch (err) {
            console.error("Error loading categories:", err);
          }
        }

        if (postData.categories?.length > 0) {
          setLoadingRelated(true);
          try {
            const related = await wpAPI.getRelatedPosts(
              postData.id,
              postData.categories,
              3
            );
            setRelatedPosts(related);
          } catch (err) {
            console.error("Error loading related posts:", err);
          } finally {
            setLoadingRelated(false);
          }
        }
      } catch (err) {
        setError("Failed to load post");
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  // Process content after load
  useEffect(() => {
    if (post?.content?.rendered && contentRef.current) {
      const contentElement = contentRef.current;
      if (!contentElement) return;

      // Process headings
      const headings = contentElement.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const headingText = heading.textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();
          heading.id = `${headingText}-${index}` || `heading-${index}`;
        }
        heading.style.scrollMarginTop = "100px";
      });

      // Process images
      const images = contentElement.querySelectorAll("img");
      images.forEach(img => {
        img.addEventListener("error", e => {
          e.target.style.display = "none";
        });

        img.classList.add("max-w-full", "h-auto", "rounded-lg");

        if (!img.complete) {
          img.classList.add("loading");
          img.addEventListener("load", () => {
            img.classList.remove("loading");
          });
        }
      });

      // Process links
      const links = contentElement.querySelectorAll('a[href^="http"]');
      links.forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });

      // Process other elements
      const elementsToProcess = [
        { selector: "p", class: "blog-paragraph" },
        { selector: "ul, ol", class: "blog-list space-y-2" },
        {
          selector: "blockquote",
          class: "blog-blockquote border-l-4 border-orange-400 pl-4 my-4",
        },
      ];

      elementsToProcess.forEach(({ selector, class: className }) => {
        const elements = contentElement.querySelectorAll(selector);
        elements.forEach(el => {
          if (selector === "p" && !el.textContent.trim()) return;
          el.classList.add(className);
        });
      });

      // Process tables
      const tables = contentElement.querySelectorAll("table");
      tables.forEach(table => {
        table.classList.add("w-full", "border-collapse");

        if (!table.parentElement.classList.contains("overflow-x-auto")) {
          const wrapper = document.createElement("div");
          wrapper.classList.add(
            "overflow-x-auto",
            "my-4",
            "shadow-sm",
            "rounded-lg"
          );
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }

        const thElements = table.querySelectorAll("th");
        thElements.forEach(th => {
          th.classList.add(
            "text-left",
            "py-3",
            "px-4",
            "bg-gray-100",
            "font-semibold",
            "border-b"
          );
        });

        const tdElements = table.querySelectorAll("td");
        tdElements.forEach(td => {
          td.classList.add("py-3", "px-4", "border-b", "border-gray-200");
        });
      });

      // Process iframes
      const iframes = contentElement.querySelectorAll("iframe");
      iframes.forEach(iframe => {
        const wrapper = document.createElement("div");
        wrapper.classList.add(
          "relative",
          "pb-[56.25%]",
          "h-0",
          "my-4",
          "overflow-hidden"
        );
        iframe.classList.add("absolute", "top-0", "left-0", "w-full", "h-full");
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
      });
    }
  }, [post?.content?.rendered]);

  // Format date
  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Share handler
  const handleShare = async platform => {
    const url = window.location.href;
    const title = post?.title?.rendered?.replace(/<[^>]*>/g, "") || "";
    const text =
      post?.excerpt?.rendered?.replace(/<[^>]*>/g, "").substring(0, 200) || "";

    switch (platform) {
      case "facebook":
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(title)}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
        break;

      case "linkedin":
        const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
          text
        )}`;
        window.open(linkedInUrl, "_blank", "width=600,height=400");
        break;

      case "instagram":
        try {
          await navigator.clipboard.writeText(url);
          alert(
            "✓ Link copied to clipboard!\n\n" +
              url +
              "\n\nInstagram doesn't support direct link sharing on web. The link has been copied - you can now paste it in your Instagram post, story, or bio."
          );
        } catch (err) {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
            alert(
              "✓ Link copied to clipboard!\n\n" +
                url +
                "\n\nYou can now paste it in your Instagram post, story, or bio."
            );
          } catch (err) {
            alert("Please manually copy this link:\n\n" + url);
          }
          document.body.removeChild(textArea);
        }
        break;

      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: text,
              url: url,
            });
          } catch (err) {
            if (err.name !== "AbortError") {
              try {
                await navigator.clipboard.writeText(url);
                alert("✓ Link copied to clipboard!");
              } catch {
                alert("Please manually copy this link:\n\n" + url);
              }
            }
          }
        } else {
          try {
            await navigator.clipboard.writeText(url);
            alert("✓ Link copied to clipboard!");
          } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand("copy");
              alert("✓ Link copied to clipboard!");
            } catch (err) {
              alert("Please manually copy this link:\n\n" + url);
            }
            document.body.removeChild(textArea);
          }
        }
        break;
    }
  };

  // Author section component
  const AuthorSection = () => {
    if (!post?.author_info) return null;

    console.log("Post data:", post);

    return (
      <div className="mt-8 pt-14 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          About the author
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <img
              src={post.author_info.avatar || "https://via.placeholder.com/80"}
              alt={post.author_info.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <h5 className="font-medium text-gray-900 text-base">
              {post.author_info.name}
            </h5>
          </div>

          {post.author_info.bio && (
            <p className="text-sm text-gray-600">{post.author_info.bio}</p>
          )}

          {(post.author_info.social.linkedin ||
            post.author_info.social.instagram) && (
            <div className="flex gap-4 mt-1">
              {post.author_info.social.linkedin && (
                <a
                  href={post.author_info.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {post.author_info.social.instagram && (
                <a
                  href={post.author_info.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Social media icons component
  const SocialMediaIcons = () => {
    const iconMap = {
      facebook: { Icon: Facebook, color: "#1877F2" },
      linkedin: { Icon: Linkedin, color: "#0077B5" },
      instagram: { Icon: Instagram, color: "#E4405F" },
      youtube: { Icon: Youtube, color: "#FF0000" },
      share: { Icon: Share2, color: "#6B7280" },
    };

    return (
      <div className="mt-6 pt-4">
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Share this article
          </h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(iconMap).map(([key, { Icon, color }]) =>
              key === "youtube" ? (
                <a
                  key={key}
                  href="https://www.youtube.com/@WrittenlyHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-50 hover:bg-orange-100 transition-colors"
                  title="Visit our YouTube channel"
                >
                  <Icon size={18} color={color} />
                </a>
              ) : (
                <button
                  key={key}
                  onClick={() => handleShare(key)}
                  className="p-2 rounded-full bg-gray-50 hover:bg-orange-100 transition-colors"
                  title={`Share on ${key}`}
                >
                  <Icon size={18} color={color} />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  // Custom sticky positioning - simplified
  const [stickyTop, setStickyTop] = useState(20);

  useEffect(() => {
    const updateStickyPosition = () => {
      if (publishedBlockRef.current) {
        const publishedBlockRect =
          publishedBlockRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const publishedBlockBottom =
          publishedBlockRect.top + scrollY + publishedBlockRect.height;

        // Calculate the top position relative to viewport
        const viewportTop = Math.max(publishedBlockBottom - scrollY + 20, 20);
        setStickyTop(viewportTop);
      }
    };

    // Use requestAnimationFrame for smoother updates
    let rafId;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateStickyPosition);
    };

    updateStickyPosition();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateStickyPosition);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateStickyPosition);
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 ">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded w-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error === "Post not found" ? "404" : "Error"}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {error === "Post not found"
              ? "The blog post you're looking for doesn't exist."
              : "Failed to load the blog post."}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const processedContent = processContent(post.content?.rendered);

  function EmbeddedForm() {
    return <div dangerouslySetInnerHTML={{ __html: '[wpforms id="18282"]' }} />;
  }

  return (
    <div className="min-h-screen bg-white ">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-9xl">
            <nav className="flex flex-wrap text-sm text-gray-500 mb-2">
              <a
                href="https://writtenlyhub.com"
                className="text-orange-500 hover:underline"
              >
                Home
              </a>
              <span className="mx-2">/</span>
              <Link to="/" className="text-orange-500 hover:underline">
                Blogs
              </Link>
              {categoryNames.length > 0 && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-gray-600">{categoryNames[0]}</span>
                </>
              )}
            </nav>

            {/* Modern split layout */}
            <div className="w-full mb-10">
              <div
                className="rounded-3xl flex flex-col-reverse lg:flex-row items-stretch gap-0 overflow-hidden relative border border-gray-100"
                style={{ minHeight: "1000px" }}
              >
                {/* Solid blue background for top 2/3 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#04265C] via-[#063A80] to-[#0A4FA5]" />

                {featuredImage && (
                  <div
                    className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-4xl"
                    style={{
                      height: "50%",
                    }}
                  >
                    <img
                      src={featuredImage || "/placeholder.svg"}
                      alt={post.title.rendered}
                      className="h-full object-cover rounded-4xl"
                      style={{
                        width: "80%",
                        maxWidth: "80%",
                      }}
                    />
                    {/* Subtle overlay on image for cohesion */}
                    <div className="absolute inset-0 bg-blue-900/20" />
                  </div>
                )}

                {/* LEFT: Blog Title + TLDR */}
                <div
                  className="relative flex-1 p-8 md:p-12 lg:p-14 flex flex-col justify-start z-10 mt-8"
                  style={{ minHeight: "600px" }}
                >
                  {/* Decorative floating elements */}
                  <div className="absolute top-10 left-10 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
                  <div
                    className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />

                  {/* Accent line with glow */}
                  <div className="relative w-20 h-1.5 mb-8 overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-indigo-400 to-purple-400 blur-sm opacity-30 group-hover:opacity-40 transition-all duration-500" />
                  </div>

                  <h1
                    className="text-3xl md:text-4xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight"
                    style={{
                      fontFamily:
                        "'Space Grotesk', 'Inter', -apple-system, sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <span className="bg-gradient-to-r from-white via-blue-50 to-blue-100 bg-clip-text text-transparent">
                      {post.title.rendered}
                    </span>
                  </h1>

                  {post.excerpt?.rendered && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur-md opacity-30 group-hover:opacity-4 transition-all duration-500" />

                      <div className="relative p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-blue-300/30 bg-white/95 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Icon with gradient */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg blur-sm opacity-50" />
                            <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-lg shadow-lg">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path
                                  fillRule="evenodd"
                                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <h2
                            className="text-base md:text-lg font-black uppercase tracking-wide bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                            }}
                          >
                            TL;DR (Key Takeaways)
                          </h2>
                        </div>
                        <div
                          className="prose prose-sm max-w-none text-gray-700 [&>ul]:list-disc [&>ul]:ml-4 [&>li]:text-gray-700 [&>ul]:space-y-2"
                          dangerouslySetInnerHTML={{
                            __html: post.excerpt.rendered,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: Content Form */}
                <div
                  className="relative flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-start z-10"
                  style={{
                    minHeight: "600px",
                    maxWidth: "540px",
                  }}
                >
                  {/* Glass morphism card */}
                  <div className="" />

                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-tr-full" />

                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative z-10">
                    <ContentForm />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Table of Contents - hidden on mobile */}
              <aside className="hidden lg:block lg:w-3/12 lg:order-first">
                <div
                  className="sticky"
                  style={{
                    top: `${stickyTop}px`,
                    maxHeight: `calc(100vh - ${stickyTop}px - 20px)`,
                  }}
                >
                  <div className="space-y-6">
                    <TOC contentRef={contentRef} />
                    <AuthorSection />
                  </div>
                </div>
              </aside>

              <article className="w-full lg:w-8/12">
                {featuredImage && (
                  <div className="mb-6">
                    <div
                      ref={publishedBlockRef}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-4 bg-gray-50 rounded-lg gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Published:
                        </span>
                        {categoryNames.map((name, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded"
                          >
                            {name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600 font-medium">
                          {formatDate(post.modified || post.date)}
                        </div>

                        <span className="text-xs text-gray-500 border-l border-gray-300 pl-3">
                          {calculateReadingTime(post.content?.rendered)}
                        </span>
                      </div>
                    </div>

                    {/* Listen to Article Section */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 flex justify-between items-center">
                      <button
                        onClick={() =>
                          handleTextToSpeech(
                            post.title.rendered + ". " + post.content?.rendered
                          )
                        }
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm">
                          {isSpeaking ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-orange-600"
                            >
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-orange-600"
                            >
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            {isSpeaking
                              ? "Stop Listening"
                              : "Listen to this article"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {isSpeaking
                              ? "Click to pause"
                              : "Click to play audio"}
                          </div>
                        </div>
                      </button>

                      {/* Soundwave Animation (Right Side) */}
                      {isSpeaking && (
                        <div className="flex gap-1 h-8 items-end">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-orange-500 rounded"
                              animate={{
                                height: ["20%", "100%", "30%"],
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="prose max-w-none">
                  {processedContent ? (
                    <div
                      ref={contentRef}
                      className="blog-content-wrapper"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                    />
                  ) : (
                    <div className="text-gray-500">No content available</div>
                  )}
                </div>

                {faqs.length > 0 && (
                  <div className="-mt-8">
                    <FaqBlock items={faqs} />
                  </div>
                )}

                {/* Mobile social sharing and newsletter */}
                <div className="lg:hidden mt-8">
                  <SocialMediaIcons />
                  <div className="mt-6">
                    <NewsletterSubscribe />
                  </div>
                </div>
              </article>

              {/* Sidebar - hidden on mobile */}
              <aside className="hidden lg:block lg:w-3/12">
                <div className="sticky" style={{ top: `${stickyTop}px` }}>
                  <SocialMediaIcons />
                  <div className="mt-8">
                    <NewsletterSubscribe />
                  </div>
                </div>
              </aside>
            </div>

            {(loadingRelated || relatedPosts.length > 0) && (
              <section className="mt-16 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  You Might Also Like
                </h2>
                {loadingRelated ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-64 bg-gray-200 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
