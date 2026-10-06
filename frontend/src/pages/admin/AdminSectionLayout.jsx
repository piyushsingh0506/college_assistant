import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../services/auth";
import {
  GraduationCap,
  LogOut,
} from "lucide-react";
import { adminLinks } from "./navigation";
import "../role-dashboards.css";

export default function AdminSectionLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const adminName = localStorage.getItem("college_name") || "Admin";

  function logout() {
    clearAuthSession();
    navigate("/login");
  }

  return (
    <div className="role-dashboard admin-dashboard">
      <aside className="role-sidebar">
        <div className="role-brand">
          <span className="role-brand-mark"><GraduationCap size={21} /></span>
          <span><strong>College</strong><small>Assistant</small></span>
        </div>

        <div className="role-user">
          <span className="role-avatar">{adminName.charAt(0).toUpperCase()}</span>
          <span><strong>{adminName}</strong><small>Administrator</small></span>
        </div>

        <nav className="role-nav" aria-label="Admin management">
          {adminLinks.map(([path, label, Icon]) => (
            <button
              key={path}
              type="button"
              className={`role-nav-link role-nav-button${location.pathname === path ? " is-current" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <button className="role-logout" onClick={logout} type="button">
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <main className="role-main">
        <header className="role-topbar">
          <div>
            <span className="role-eyebrow">ADMINISTRATOR PORTAL</span>
            <h1>College administration</h1>
          </div>
          <div className="role-topbar-user">
            <span className="role-date">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="role-avatar">{adminName.charAt(0).toUpperCase()}</span>
            <span className="role-topbar-name">{adminName}</span>
          </div>
        </header>

        <div className="role-content">
          {children}
        </div>
      </main>
    </div>
  );
}
