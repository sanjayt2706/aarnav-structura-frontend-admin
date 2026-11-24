import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Enquiries";
import Visitors from "./pages/Visitors";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Team from "./pages/Team";
import WebsiteContent from "./pages/WebsiteContent";
import MediaLibrary from "./pages/MediaLibrary";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/enquiries" element={<ProtectedRoute><Enquiries /></ProtectedRoute>} />
          <Route path="/visitors" element={<ProtectedRoute><Visitors /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/content" element={<ProtectedRoute><WebsiteContent /></ProtectedRoute>} />
          <Route path="/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
          <Route path="/settings" element={<Navigate to="/content" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
