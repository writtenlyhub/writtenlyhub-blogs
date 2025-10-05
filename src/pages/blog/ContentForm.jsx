import React, { useState } from "react";

const ContentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name || !formData.email) return;

    try {
      setStatus("loading");

      const data = new FormData();
      data.append("action", "submit_content_form");
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("message", formData.message);

      const res = await fetch(
        "https://www.writtenlyhub.com/wp-admin/admin-ajax.php",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result?.data?.message || "Submission failed");
      }

      setFormData({ name: "", email: "", phone: "", message: "" });
      setStatus("success");
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="mt-10 bg-white border p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-orange-500 mb-2">Content Form</h3>
      <p className="text-gray-700 mb-4 text-sm">
        Share your details and message with us. We’ll get back to you soon.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter your phone number (optional)"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="mb-1 text-sm font-semibold text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your message"
            className="px-4 py-2 border border-gray-300 rounded-md"
            rows={4}
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-green-600 mt-2 text-sm">
          ✅ Your content was submitted successfully!
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-2 text-sm">
          ❌ Oops! Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
};

export default ContentForm;
