import React from "react";

const BlogHero = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onClearCategory,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="bg-white text-[#022150] pt-22 pb-8 px-4">
      {/* Changed text-center to text-left and added md:text-center */}
      <div className="max-w-7xl mx-auto text-left md:text-center">
        {/* Title with SVG */}
        {/* Changed justify-center to justify-start and added md:justify-center */}
        <div className="flex items-center justify-start md:justify-center mb-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Blogs at <span className="text-[#022150]">WrittenlyHub</span>
          </h1>
          <svg
            width="40"
            className="ml-2"
            viewBox="0 0 103 114"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M68.3001 114L59.6 105.6C57.7 107 55.4001 106.7 53.9001 105.9C54.8001 105.7 55.8001 104.4 55.9001 104.4C53.5001 106 49.6 105.7 49.6 105.7C53.1 104.8 54.8001 103.4 54.9001 103.3L50 104.9L53.4001 102.7C49.6001 104.5 45.1001 103.8 43.7001 101.7C46.9001 102.9 49.2001 100.8 49.2001 100.8C43.8001 102.6 42.4 97.3 38.3 98C40.3 96.1 42.9001 96.7 42.9001 96.7C41.8001 95.4 40.4 93.5 39.1 91.1C38.2 88.5 38.3 83.9 40.1 79.6C43.8 73.5 53.0001 71 58.4001 71C56.0001 72.4 52.8 75.1 52.1 77.2C54 74.6 58.9001 72.3 58.9001 72.3C58.9001 72.3 59.6001 76.1 60.8001 78.6C62.4001 81.8 62.7001 83.5 61.4001 85.1C60.2001 86.7 58.3 88.5 57.1 92.4C58.8 88.4 62.2 86 64.6 85.7C61.8 87.6 59.3 91.7 59.1 92.1C61.5 88.9 64.9001 88.2 64.9001 88.2C61.4001 90.7 59.1 96 59 96.2C61.4 91.7 65.4001 90.7 65.4001 90.7C63.9001 91.6 62.4 93.9 61.7 96.9C62.4 94.8 65.3001 94.2 65.3001 94.2C62.7001 97.1 66 101 62.5 103.3C60.3 101.9 51.2 90.6 46.1 84.7C50.9 92.6 68.1001 113.7 68.3001 114Z"
              fill="url(#paint0_linear_15_41)"
            />
            <path
              d="M66.3 38.1C74.6 32.2 85.4 31.7 85.4 31.7C79.5 42.3 70.7999 49.5 61.5999 52.5C69.0999 52.3 76.4 46.3 76.4 46.3C73.8 56.9 63.6999 61 55.0999 62.5C62.8999 63.4 68.0999 60.9 68.0999 60.9C66.1999 64.9 60.9999 67.8 56.2999 69.1C51.5999 70.5 43.3 72.1 40.2 79.5C38.3 83.8 38.3 88.4 39.2 91C37 87 35.3 81.7 36.2 75.6C37.9 65 46.3999 51.8 53.2999 44.6C41.9999 52.6 35.2 67.8 35.2 67.8C37.8 52.2 44.8 31.1 60.5 23.2C76.2 15.3 90.8999 19.9 102.1 11.4C97.8999 28.5 75.5 28.6 66.3 38.1Z"
              fill="url(#paint1_linear_15_41)"
            />
            <path
              d="M33.2001 67.9C33.1001 52.7 41.4001 38.8 41.4001 38.8C41.4001 38.8 31.4 34.3 23.5 34.4C27.5 32.2 28.4 29.1 28.3 26.9C26.8 29.7 22.4 31 14.6 31.4C10.2 31.6 7.40005 34.7 7.90005 37.7C7.90005 37.7 3.30005 38.9 0.800049 45.1C7.20005 42.3 14.5 43.7 22.9 53.9C22.9 53.9 19.9 47.2 16.1 45C23.8 48.6 30.4001 56.6 33.2001 67.9Z"
              fill="url(#paint2_linear_15_41)"
            />
            <path
              d="M44.1001 34.5C50.7001 24.4 59.6001 19.9 70.1001 16.3C80.6001 12.7 80.2001 3.5 77.1001 0C75.4001 13.2 47.1001 15.8 44.1001 34.5Z"
              fill="url(#paint3_linear_15_41)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_15_41"
                x1="64.3292"
                y1="122.668"
                x2="46.3689"
                y2="79.6915"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F45400" />
                <stop offset="1" stopColor="#E27921" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_15_41"
                x1="91.3185"
                y1="65.6111"
                x2="42.7528"
                y2="31.7489"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E77C23" />
                <stop offset="0.5653" stopColor="#F87C09" />
                <stop offset="1" stopColor="#F75700" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_15_41"
                x1="8.45595"
                y1="32.8872"
                x2="41.8297"
                y2="54.6125"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F45400" />
                <stop offset="1" stopColor="#E27921" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_15_41"
                x1="37.0418"
                y1="38.9915"
                x2="91.3072"
                y2="-5.7293"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F45400" />
                <stop offset="1" stopColor="#E27921" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Subtitle */}
        <p className="text-gray-700 text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-left md:text-center">
          Explore insightful articles and updates across various topics.
        </p>

        {/* Categories */}
        {/* Changed justify-center to justify-start and added md:justify-center */}
        <div className="flex flex-wrap justify-start md:justify-center gap-3 mb-8">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors border border-[#022150] ${
                selectedCategory === cat.id
                  ? "bg-[#022150] text-white font-semibold"
                  : "bg-transparent text-[#022150] hover:bg-[#022150]/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
          {selectedCategory && (
            <button
              onClick={onClearCategory}
              className="text-sm md:text-base text-red-500 hover:text-red-700 underline transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Box */}
        {/* Changed mx-auto to mr-auto and added md:mx-auto */}
        <div className="max-w-2xl mr-auto md:mx-auto relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search blogs..."
            className="w-full px-6 py-4 rounded-lg bg-white border border-gray-300 text-[#022150] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#022150] focus:border-transparent transition-all"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
