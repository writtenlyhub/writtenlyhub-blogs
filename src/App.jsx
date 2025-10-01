import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlogListing from "./pages/blog/BlogListing";
import BlogDetail from "./pages/blog/BlogDetail";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Root route: blog listing */}
        <Route path="/" element={<BlogListing />} />
        {/* Detail route: slug directly under root */}
        <Route path="/:category/:slug" element={<BlogDetail />} />
        {/* Catch all to listing */}
        <Route path="*" element={<BlogListing />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
