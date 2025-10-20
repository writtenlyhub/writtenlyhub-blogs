import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlogListing from "./pages/blog/BlogListing";
import BlogDetail from "./pages/blog/BlogDetail";
import Footer from "./components/Footer";

function App() {
  // Base path for the router when the app is served under a subpath (e.g., /blog)
  // Default to '/' for local dev; set VITE_ROUTER_BASENAME=/blog in production hosting under /blog
  const basename = import.meta.env.VITE_ROUTER_BASENAME || "/";
  return (
    <Router basename={basename}>
      <Navbar />

      <Routes>
        {/* Root route: blog listing */}
        <Route path="/" element={<BlogListing />} />
        {/* Detail route: slug directly under root */}
        <Route path=":slug" element={<BlogDetail />} />
        {/* Optional trailing slash variant */}
        <Route path=":slug/" element={<BlogDetail />} />
        {/* Catch all to listing */}
        <Route path="*" element={<BlogListing />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
