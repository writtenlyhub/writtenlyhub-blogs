import React, { useState, useRef, useEffect } from 'react';
import './FaqBlock.css';

const FaqBlock = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const refs = useRef([]);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      if (openIndex === i) {
        ref.style.height = ref.scrollHeight + 'px';
      } else {
        ref.style.height = '0px';
      }
    });
  }, [openIndex]);

  return (
    <div className="faq-block">
      {items.map((item, i) => (
        <div key={i} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
          >
            {item.q}
            <span className="faq-toggle">{openIndex === i ? '−' : '+'}</span>
          </button>
          <div
            ref={(el) => (refs.current[i] = el)}
            id={`faq-answer-${i}`}
            className={`faq-answer`}
          >
            <div className="faq-content" dangerouslySetInnerHTML={{ __html: item.a }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqBlock;
