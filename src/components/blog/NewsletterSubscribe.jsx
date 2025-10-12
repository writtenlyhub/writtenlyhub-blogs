import React, { useState } from "react";

const NewsletterSubscribe = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !name) return;

    try {
      setStatus("loading");

      const formData = new FormData();
      formData.append("action", "submit_newsletter");
      formData.append("name", name);
      formData.append("email", email);

      const res = await fetch(
        "https://www.writtenlyhub.com/wp-admin/admin-ajax.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error("Submission failed");

      setName("");
      setEmail("");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="mt-10 bg-white  p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-orange-500 mb-2">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-gray-700 mb-4 text-sm">
        Get the latest blogs, tips, and writing resources delivered straight to
        your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <div className="flex flex-row sm:flex-col gap-3">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </form>

      {status === "success" && (
        <p className="text-green-600 mt-2 text-sm">You're subscribed! 🎉</p>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-2 text-sm">Oops! Something went wrong.</p>
      )}
    </div>
  );
};

export default NewsletterSubscribe;
