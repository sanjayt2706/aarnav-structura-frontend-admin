import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Overview", icon: "📊", end: true },
  { to: "/enquiries", label: "Enquiries", icon: "📩" },
  { to: "/visitors", label: "Visitors", icon: "👥" }
  // { to: "/projects", label: "Projects", icon: "🏗️" },
  // { to: "/gallery", label: "Gallery", icon: "🖼️" },
  // { to: "/services", label: "Services", icon: "🛠️" },
  // { to: "/testimonials", label: "Testimonials", icon: "💬" },
  // { to: "/team", label: "Team", icon: "👷" },
  // { to: "/settings", label: "Website Content", icon: "⚙️" }
];

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          AARNAV STRUCTURA
          <span>Admin Dashboard</span>
        </div>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <span>{l.icon}</span> {l.label}
          </NavLink>
        ))}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            {admin?.name}
            <br />
            <span style={{ opacity: 0.7 }}>{admin?.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
