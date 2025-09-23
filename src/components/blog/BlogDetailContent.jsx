// src/components/blog/BlogDetailContent.jsx
import React, { useEffect } from 'react';

const BlogDetailContent = ({ content }) => {
  useEffect(() => {
    // Add styling to content elements
    const contentDiv = document.querySelector('.blog-content');
    if (contentDiv) {
      // Style headings
      const headings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
        heading.className = 'font-bold text-gray-900 mb-4 mt-8';
        
        switch (heading.tagName.toLowerCase()) {
          case 'h1':
            heading.className += ' text-3xl';
            break;
          case 'h2':
            heading.className += ' text-2xl';
            break;
          case 'h3':
            heading.className += ' text-xl';
            break;
          case 'h4':
            heading.className += ' text-lg';
            break;
          default:
            heading.className += ' text-base';
        }
      });

      // Style paragraphs
      const paragraphs = contentDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.className = 'text-gray-700 leading-relaxed mb-6';
      });

      // Style lists
      const lists = contentDiv.querySelectorAll('ul, ol');
      lists.forEach(list => {
        list.className = 'mb-6 pl-6';
        if (list.tagName === 'UL') {
          list.className += ' list-disc';
        } else {
          list.className += ' list-decimal';
        }
      });

      const listItems = contentDiv.querySelectorAll('li');
      listItems.forEach(li => {
        li.className = 'text-gray-700 leading-relaxed mb-2';
      });

      // Style blockquotes
      const blockquotes = contentDiv.querySelectorAll('blockquote');
      blockquotes.forEach(quote => {
        quote.className = 'border-l-4 border-blue-500 pl-6 py-4 mb-6 bg-blue-50 italic text-gray-800';
      });

      // Style links
      const links = contentDiv.querySelectorAll('a');
      links.forEach(link => {
        link.className = 'text-blue-600 hover:text-blue-800 underline';
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

      // Style images
      const images = contentDiv.querySelectorAll('img');
      images.forEach(img => {
        img.className = 'max-w-full h-auto rounded-lg shadow-md mb-6';
        img.setAttribute('loading', 'lazy');
      });

      // Style code blocks
      const codeBlocks = contentDiv.querySelectorAll('pre');
      codeBlocks.forEach(pre => {
        pre.className = 'bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-6';
      });

      const inlineCode = contentDiv.querySelectorAll('code');
      inlineCode.forEach(code => {
        if (!code.closest('pre')) {
          code.className = 'bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm';
        }
      });

      // Style tables
      const tables = contentDiv.querySelectorAll('table');
      tables.forEach(table => {
        table.className = 'w-full border-collapse border border-gray-300 mb-6';
        
        const ths = table.querySelectorAll('th');
        ths.forEach(th => {
          th.className = 'bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold';
        });

        const tds = table.querySelectorAll('td');
        tds.forEach(td => {
          td.className = 'border border-gray-300 px-4 py-2';
        });
      });
    }
  }, [content]);

  return (
    <div 
      className="blog-content prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogDetailContent;