import React from "react";

/**
 * NewsletterSubscribe (WPForms embed)
 *
 * Keeps the same outer UI (heading + description) but renders a WPForms form
 * inside an iframe, like `ContentForm`. Configure the target via env:
 * - VITE_WPFORM_NEWSLETTER_URL: Full URL to a WP page showing the WPForms form
 * - or set both VITE_WP_BASE_URL and VITE_WPFORM_NEWSLETTER_ID to generate:
 *     ${VITE_WP_BASE_URL}/?wpforms_form_id=ID&wpforms_form_pages=1
 */
const NewsletterSubscribe = () => {
  const base =
    import.meta.env.VITE_WP_BASE_URL || "https://www.writtenlyhub.com";
  const id = import.meta.env.VITE_WPFORM_NEWSLETTER_ID || "18499"; // provided ID
  const derivedFromId = id
    ? `${base}/?wpforms_form_id=${id}&wpforms_form_pages=1`
    : null;
  const defaultUrl = "https://www.writtenlyhub.com/newsletter-form/"; // provided page URL
  const formUrl =
    defaultUrl || import.meta.env.VITE_WPFORM_NEWSLETTER_URL || derivedFromId;

  return (
    <div className="mt-10 bg-white pb-1 rounded-lg shadow-md max-w-2xl mx-auto overflow-hidden">
      <h3 className="text-lg font-bold text-[#012150] mb-2 px-6 pt-3">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-gray-700 mb-4 text-sm px-6">
        Get the latest blogs, tips, and writing resources delivered straight to
        your inbox.
      </p>

      {formUrl ? (
        <iframe
          title="Newsletter form"
          src={formUrl}
          className="w-full"
          style={{ minHeight: 200, border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 p-3 rounded">
          Please set an env var for the newsletter form:
          <ul className="list-disc ml-5 mt-2">
            <li>
              <strong>VITE_WPFORM_NEWSLETTER_URL</strong> (preferred) — the full
              page URL that renders the WPForms newsletter form.
            </li>
            <li>
              Or set <strong>VITE_WP_BASE_URL</strong> and
              <strong> VITE_WPFORM_NEWSLETTER_ID</strong> to generate the URL.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewsletterSubscribe;
