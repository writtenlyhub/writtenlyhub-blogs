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
    <div
      className="mt-10 px-8 py-10 bg-white rounded-xl mx-auto overflow-hidden form-embed-wrapper"
      style={{
        maxWidth: "760px",
        border: "2px solid #012150",
        boxShadow: "10px 10px 0 #012150",
      }}
    >
      <h3 className="text-3xl font-bold ml-8 mb-6 text-[#04265C] tracking-tight">
        Get your custom strategy today!
      </h3>
      <iframe
        title="Contact form"
        src={formUrl}
        className="w-full"
        style={{ minHeight: 450, border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* NOTE: The button styling lives inside the WordPress iframe. To make it full width & less rounded, ensure in WPForms Additional CSS you target the form ID like:
        #wpforms-form-18282 .wpforms-submit, #wpforms-submit-18282 { width:100%; border-radius:0.375rem !important; }
        Adjust the ID if different. */}
    </div>
  );
};

export default ContentForm;
