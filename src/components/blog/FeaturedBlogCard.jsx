import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const FeaturedBlogCard = ({ post, getCategoryName }) => {
  if (!post) {
    return (
      <div className="block bg-white rounded-xl overflow-hidden border border-[#022150]">
        <div className="md:flex">
          <div className="md:w-1/2 h-64 md:h-80 bg-gray-200"></div>
          <div className="md:w-1/2 p-6">
            <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/assets/placeholder.png";

  const date = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const categoryId = post.categories?.[0];
  const categoryName =
    categoryId && getCategoryName ? getCategoryName(categoryId) : "";

  const title = post.title?.rendered || "Untitled Post";
  const excerpt = post.excerpt?.rendered || "";
  const slug = post.slug || "";

  const cleanExcerpt =
    excerpt.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

  return (
    <div className="block bg-white rounded-xl overflow-hidden border border-[#022150] group">
      <div className="md:flex h-full">
        <div className="md:w-1/2">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-64 md:h-80 object-cover"
            onError={e => {
              e.target.src = "/assets/placeholder.png";
            }}
          />
        </div>

        <div className="md:w-1/2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            {categoryName && (
              <span className="inline-block text-xs font-semibold text-orange-500 bg-transparent rounded-full">
                {categoryName}
              </span>
            )}
            {date && <span className="text-xs text-[#022150]">{date}</span>}
          </div>

          <h2
            className="text-2xl md:text-3xl font-bold mb-4 text-[#022150] line-clamp-2 select-text"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {cleanExcerpt && (
            <p className="text-[#022150] mb-4 line-clamp-3 leading-relaxed select-text flex-grow">
              {cleanExcerpt}
            </p>
          )}

          <Link
            to={`/blog/${slug}`}
            className="text-orange-500 font-semibold text-sm border border-orange-500 rounded-full px-8 py-2 hover:bg-orange-500 hover:text-white transition-colors duration-200 inline-block w-fit mt-auto"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

FeaturedBlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    slug: PropTypes.string,
    date: PropTypes.string,
    title: PropTypes.shape({
      rendered: PropTypes.string,
    }),
    excerpt: PropTypes.shape({
      rendered: PropTypes.string,
    }),
    categories: PropTypes.array,
    _embedded: PropTypes.shape({
      author: PropTypes.array,
      "wp:featuredmedia": PropTypes.array,
    }),
  }),
  getCategoryName: PropTypes.func,
};

export default FeaturedBlogCard;
