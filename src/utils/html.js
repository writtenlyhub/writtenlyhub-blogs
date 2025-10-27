// Small utility to decode HTML entities (e.g., &#8217; → ’)
// Uses a browser textarea to safely decode without adding dependencies
export function decodeHtmlEntities(html) {
  if (!html || typeof html !== "string") return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
