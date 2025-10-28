import React, { useState, useEffect } from "react";
import "./TOC.css";

const TOC = ({ contentRef }) => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const extractHeadings = () => {
      if (!contentRef?.current) return;

      setTimeout(() => {
        let headingElements = contentRef.current.querySelectorAll("h1");

        // If no h1s found, fallback to h2
        if (headingElements.length === 0) {
          headingElements = contentRef.current.querySelectorAll("h2");
        }

        if (headingElements.length === 0) {
          setIsVisible(false);
          return;
        }

        const headingsList = Array.from(headingElements).map(
          (heading, index) => {
            let headingId = heading.id;

            if (!headingId) {
              headingId = heading.textContent
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .trim();

              headingId = `${headingId}-${index}`;
              heading.id = headingId;
            }

            return {
              id: headingId,
              text: heading.textContent.trim(),
              level: parseInt(heading.tagName.charAt(1)),
              element: heading,
            };
          }
        );

        setHeadings(headingsList);
        setIsVisible(true);
      }, 500); // wait for content to render
    };

    extractHeadings();
  }, [contentRef?.current, contentRef?.current?.innerHTML]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      rootMargin: "-10% 0% -80% 0%",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback = entries => {
      let currentActive = "";
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          currentActive = entry.target.id;
        }
      });

      if (currentActive) {
        setActiveHeading(currentActive);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    if (headings.length > 0 && !activeHeading) {
      setActiveHeading(headings[0].id);
    }

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (headingId, event) => {
    event.preventDefault();

    const element = document.getElementById(headingId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveHeading(headingId);
    }
  };

  if (!isVisible || headings.length === 0) {
    return null;
  }

  return (
    <div className="toc-wrapper border-t border-gray-200">
      <h4 className="toc-title pt-4">Contents</h4>
      <nav className="toc-nav">
        {headings.map(heading => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={e => scrollToHeading(heading.id, e)}
            className={`toc-item toc-level-${heading.level} ${
              activeHeading === heading.id ? "toc-active" : ""
            }`}
          >
            {heading.text}
          </a>
        ))}

        {/* Back to Top link */}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="toc-item toc-back-to-top"
        >
          ↑ Back to Top
        </a>
      </nav>
    </div>
  );
};

export default TOC;
