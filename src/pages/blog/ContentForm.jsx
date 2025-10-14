import React from "react";

/**
 * WPForms embed
 *
 * Prefer using a dedicated WPForms Form Page URL and set it via VITE_WPFORMS_URL.
 * Fallback tries a generic query-based form page for id=18282.
 */
const ContentForm = () => {
  const defaultUrl =
    // "https://www.writtenlyhub.com/?wpforms_form_id=18282&wpforms_form_pages=1";
    "https://www.writtenlyhub.com/get-your-custom-strategy-today/";
  const formUrl = import.meta.env.VITE_WPFORMS_URL || defaultUrl;

  return (
    <div className="mt-10 bg-white border p-0 rounded-lg shadow-md max-w-2xl mx-auto overflow-hidden">
      <iframe
        title="Contact form"
        src={formUrl}
        className="w-full"
        style={{ minHeight: 720, border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default ContentForm;
