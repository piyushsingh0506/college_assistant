import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  GraduationCap,
  LogOut,
  Users,
} from "lucide-react";
import api from "../../services/api";
import { clearAuthSession } from "../../services/auth";
import "../role-dashboards.css";
import { adminLinks } from "./navigation";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");

  const adminName = localStorage.getItem("college_name") || "Admin";

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/admin/dashboard");
      setStats(response.data);
      setStatsError("");
    } catch (error) {
      setStatsError(
        error.response?.data?.detail || "Dashboard data could not be loaded."
      );
    }
  }

  function logout() {
    clearAuthSession();
    navigate("/login");
  }

  return (
    <div className="role-dashboard admin-dashboard">
      <aside className="role-sidebar">
        <div className="role-brand">
          <span className="role-brand-mark">
            <GraduationCap size={21} />
          </span>
          <span>
            <strong>College</strong>
            <small>Assistant</small>
          </span>
        </div>

        <div className="role-user">
          <span className="role-avatar">{adminName.charAt(0).toUpperCase()}</span>
          <span>
            <strong>{adminName}</strong>
            <small>Administrator</small>
          </span>
        </div>

        <nav className="role-nav" aria-label="Admin dashboard">
          {adminLinks.map(([path, label, Icon]) => (
            <button
              key={path}
              type="button"
              className={`role-nav-link role-nav-button${
                path === "/admin" ? " is-current" : ""
              }`}
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
          {statsError && (
            <div className="role-alert" role="alert">
              {statsError}
            </div>
          )}

          <section className="role-welcome" id="admin-overview">
            <div>
              <span className="role-eyebrow">SYSTEM OVERVIEW</span>
              <h2>Welcome, {adminName}.</h2>
              <p>
                Manage students, faculty, academics, schedules, examinations,
                laboratories and campus notices from one place.
              </p>
            </div>
            <span className="role-id-chip">Administrator</span>
          </section>

          <section className="role-metrics" aria-label="College summary">
            <article className="role-metric">
              <span className="metric-icon metric-green"><Users size={19} /></span>
              <div>
                <small>Total students</small>
                <strong>{stats ? stats.students : "..."}</strong>
                <span>Registered students</span>
              </div>
            </article>

            <article className="role-metric">
              <span className="metric-icon metric-blue"><GraduationCap size={19} /></span>
              <div>
                <small>Total faculty</small>
                <strong>{stats ? stats.faculty : "..."}</strong>
                <span>Teaching staff</span>
              </div>
            </article>

            <article className="role-metric">
              <span className="metric-icon metric-amber"><BookOpen size={19} /></span>
              <div>
                <small>Total subjects</small>
                <strong>{stats ? stats.subjects : "..."}</strong>
                <span>Active academic subjects</span>
              </div>
            </article>

            <article className="role-metric">
              <span className="metric-icon metric-coral"><CalendarDays size={19} /></span>
              <div>
                <small>Administration</small>
                <strong>Active</strong>
                <span>College system online</span>
              </div>
            </article>
          </section>

          <div className="role-columns-wide admin-dashboard-grid">
            <section className="role-panel">
              <div className="role-panel-heading">
                <div>
                  <span className="role-eyebrow">COMMON TASKS</span>
                  <h2>Quick actions</h2>
                </div>
                <ClipboardList size={19} />
              </div>

              <div className="admin-action-list">
                <AdminAction icon={Users} title="Manage students" text="Register and update student records." onClick={() => navigate("/admin/students")} />
                <AdminAction icon={GraduationCap} title="Manage faculty" text="Maintain faculty and teaching records." onClick={() => navigate("/admin/faculty")} />
                <AdminAction icon={BookOpen} title="Manage subjects" text="Create and maintain academic subjects." onClick={() => navigate("/admin/subjects")} />
                <AdminAction icon={CalendarDays} title="Create timetable" text="Schedule classes and rooms." onClick={() => navigate("/admin/timetable")} />
                <AdminAction icon={Bell} title="Publish notice" text="Share important campus announcements." onClick={() => navigate("/admin/notices")} />
                <AdminAction icon={FlaskConical} title="Manage labs" text="Maintain laboratory information." onClick={() => navigate("/admin/labs")} />
              </div>
            </section>

            <section className="role-panel">
              <div className="role-panel-heading">
                <div>
                  <span className="role-eyebrow">ADMINISTRATION</span>
                  <h2>System overview</h2>
                </div>
                <FileText size={19} />
              </div>

              <div className="admin-overview-list">
                <div><span>Students</span><strong>{stats ? stats.students : "..."}</strong></div>
                <div><span>Faculty</span><strong>{stats ? stats.faculty : "..."}</strong></div>
                <div><span>Subjects</span><strong>{stats ? stats.subjects : "..."}</strong></div>
                <div><span>Portal status</span><strong className="status-pill">Online</strong></div>
              </div>

              <div className="admin-system-note">
                <strong>College Assistant</strong>
                <p>Centralized administration for academic records, schedules, examinations and campus communication.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminAction({ icon: Icon, title, text, onClick }) {
  return (
    <button type="button" className="admin-action" onClick={onClick}>
      <span className="admin-action-icon"><Icon size={18} /></span>
      <span className="admin-action-copy">
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <span className="admin-action-arrow">→</span>
    </button>
  );
}
