import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Bot,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import api from "../../services/api";
import { clearAuthSession } from "../../services/auth";
import "../role-dashboards.css";

import DigitalID from "./DigitalID";
import Timetable from "./Timetable";
import Attendance from "./Attendance";
import { getAverageAttendance } from "./attendanceMetrics";
import Assignments from "./Assignments";
import Exams from "./Exams";
import Labs from "./Labs";
import Notifications from "./Notifications";
import Replacements from "./Replacements";
import StudyAssistant from "./StudyAssistant";

const sections = [
  ["overview", "Dashboard", LayoutDashboard],
  ["student-id", "Digital ID", GraduationCap],
  ["student-schedule", "Timetable", CalendarDays],
  ["student-attendance", "Attendance", CheckCircle2],
  ["student-assignments", "Assignments", ClipboardList],
  ["student-exams", "Exams", BookOpen],
  ["student-labs", "Labs", FlaskConical],
  ["student-notifications", "Notifications", Bell],
  ["student-replacements", "Replacements", Clock3],
  ["student-ai", "Study Assistant", Bot],
];

const emptyData = {
  profile: null,
  marks: [],
  attendance: [],
  timetable: [],
  assignments: [],
  exams: [],
  notices: [],
  notifications: [],
  labs: [],
  replacements: [],
};

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("overview");

  const [data, setData] =
    useState(emptyData);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  /* =========================
     LOAD STUDENT DATA
  ========================= */

  useEffect(() => {
    let mounted = true;

    const endpoints = [
      ["profile", "/student/profile"],
      ["marks", "/student/marks"],
      ["attendance", "/student/attendance"],
      ["timetable", "/student/timetable"],
      ["assignments", "/student/assignments"],
      ["exams", "/student/exams"],
      ["notices", "/student/notices"],
      ["notifications", "/student/notifications"],
      ["labs", "/student/labs"],
      ["replacements", "/student/replacements"],
    ];

    async function loadDashboard() {
      try {
        const results =
          await Promise.allSettled(
            endpoints.map(
              ([, endpoint]) =>
                api.get(endpoint)
            )
          );

        if (!mounted) return;

        const nextData = {
          ...emptyData,
        };

        const failures = [];

        results.forEach(
          (result, index) => {
            const [key] =
              endpoints[index];

            if (
              result.status ===
              "fulfilled"
            ) {
              nextData[key] =
                result.value.data;
            } else {
              failures.push(key);
            }
          }
        );

        setData(nextData);

        if (failures.length > 0) {
          setLoadError(
            `Some sections could not load: ${failures.join(
              ", "
            )}`
          );
        }

        setLoading(false);
      } catch (error) {
        if (!mounted) return;

        setLoadError(
          "Unable to load student dashboard."
        );

        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================
     SIDEBAR NAVIGATION ONLY
  ========================= */

  function selectSection(sectionId) {
    setActiveSection(sectionId);
  }

  /* =========================
     LOGOUT
  ========================= */

  function logout() {
    clearAuthSession();
    navigate("/login");
  }

  /* =========================
     STUDENT INFORMATION
  ========================= */

  const profile = data.profile || {};

  const studentName =
    profile?.name ||
    localStorage.getItem(
      "college_name"
    ) ||
    "Student";

  const firstName =
    studentName.split(" ")[0];

  const notificationCount =
    data.notifications.filter(
      (item) =>
        item?.is_read === false ||
        item?.read === false
    ).length;

  /* =========================
     DASHBOARD OVERVIEW
  ========================= */
function renderOverview() {
  const averageAttendance =
    getAverageAttendance(data.attendance);

  const averageMarks =
    data.marks.length > 0
      ? Math.round(
          data.marks.reduce(
            (sum, item) =>
              sum +
              Number(
                item.total ||
                  item.marks ||
                  0
              ),
            0
          ) / data.marks.length
        )
      : null;

  return (
    <>
      {/* =========================
          WELCOME
      ========================= */}

      <section className="role-welcome student-welcome">
        <div>
          <span className="role-eyebrow">
            STUDENT PORTAL
          </span>

          <h2>
            Welcome back, {firstName} 👋
          </h2>

          <p>
            {profile?.course
              ? `${profile.course} · Semester ${
                  profile.semester || "—"
                } · Section ${
                  profile.section || "—"
                }`
              : "Your academic dashboard and college activities."}
          </p>
        </div>

        {profile?.enrollment_no && (
          <span className="role-id-chip">
            ID&nbsp; {profile.enrollment_no}
          </span>
        )}
      </section>

      {/* =========================
          ERROR
      ========================= */}

      {loadError && (
        <div className="role-alert">
          {loadError}
        </div>
      )}

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="role-metrics">

        {/* AVERAGE MARKS */}

        <article className="role-metric">
          <span className="metric-icon metric-green">
            <BookOpen size={19} />
          </span>

          <div>
            <small>
              Average Marks
            </small>

            <strong>
              {loading
                ? "..."
                : averageMarks === null
                ? "—"
                : `${averageMarks}%`}
            </strong>

            <span>
              Across recorded subjects
            </span>
          </div>
        </article>

        {/* ATTENDANCE */}

        <article className="role-metric">
          <span className="metric-icon metric-blue">
            <CheckCircle2 size={19} />
          </span>

          <div>
            <small>
              Attendance
            </small>

            <strong>
              {loading
                ? "..."
                : averageAttendance === null
                ? "—"
                : `${averageAttendance}%`}
            </strong>

            <span>
              Average attendance
            </span>
          </div>
        </article>

        {/* ASSIGNMENTS */}

        <article className="role-metric">
          <span className="metric-icon metric-amber">
            <ClipboardList size={19} />
          </span>

          <div>
            <small>
              Assignments
            </small>

            <strong>
              {loading
                ? "..."
                : data.assignments.length}
            </strong>

            <span>
              Semester assignments
            </span>
          </div>
        </article>

        {/* EXAMS */}

        <article className="role-metric">
          <span className="metric-icon metric-coral">
            <CalendarDays size={19} />
          </span>

          <div>
            <small>
              Exams
            </small>

            <strong>
              {loading
                ? "..."
                : data.exams.length}
            </strong>

            <span>
              Scheduled exams
            </span>
          </div>
        </article>

      </section>
    </>
  );
}
  
  /* =========================
     ACTIVE SECTION
  ========================= */

  function renderActiveSection() {
    if (loading) {
      return (
        <section className="role-panel">
          <span className="role-eyebrow">
            COLLEGE ASSISTANT
          </span>

          <h2>
            Loading student dashboard...
          </h2>

          <p className="role-empty">
            Please wait.
          </p>
        </section>
      );
    }

    switch (activeSection) {
      case "student-id":
        return (
          <DigitalID
            profile={data.profile}
          />
        );

      case "student-schedule":
        return (
          <Timetable
            timetable={
              data.timetable
            }
          />
        );

      case "student-attendance":
        return (
          <Attendance
            attendance={
              data.attendance
            }
          />
        );

      case "student-assignments":
        return (
          <Assignments
            assignments={
              data.assignments
            }
          />
        );

      case "student-exams":
        return (
          <Exams
            exams={data.exams}
          />
        );

      case "student-labs":
        return (
          <Labs
            labs={data.labs}
          />
        );

      case "student-notifications":
        return (
          <Notifications
            notifications={
              data.notifications
            }
            notices={data.notices}
          />
        );

      case "student-replacements":
        return (
          <Replacements
            replacements={
              data.replacements
            }
          />
        );

      case "student-ai":
        return (
          <StudyAssistant />
        );

      case "overview":
      default:
        return renderOverview();
    }
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="role-dashboard student-dashboard">

      {/* =====================
          SIDEBAR
      ===================== */}

      <aside className="role-sidebar">

        {/* LOGO */}
        <div className="role-brand">
          <span className="role-brand-mark">
            <GraduationCap
              size={21}
            />
          </span>

          <span>
            <strong>
              College
            </strong>

            <small>
              Assistant
            </small>
          </span>
        </div>

        {/* USER */}
        <div className="role-user">
          <span className="role-avatar">
            {studentName
              .charAt(0)
              .toUpperCase()}
          </span>

          <span>
            <strong>
              {studentName}
            </strong>

            <small>
              Student portal
            </small>
          </span>
        </div>

        {/* ONLY NAVIGATION */}
        <nav
          className="role-nav"
          aria-label="Student dashboard navigation"
        >
          {sections.map(
            ([
              id,
              label,
              Icon,
            ]) => (
              <button
                type="button"
                key={id}
                className={`role-nav-button ${
                  activeSection ===
                  id
                    ? "is-current"
                    : ""
                }`}
                onClick={() =>
                  selectSection(
                    id
                  )
                }
                aria-current={
                  activeSection ===
                  id
                    ? "page"
                    : undefined
                }
              >
                <Icon size={17} />

                <span>
                  {label}
                </span>

                {id ===
                  "student-notifications" &&
                  notificationCount >
                    0 && (
                    <span className="sidebar-badge">
                      {
                        notificationCount
                      }
                    </span>
                  )}
              </button>
            )
          )}
        </nav>

        {/* LOGOUT */}
        <button
          type="button"
          className="role-logout"
          onClick={logout}
        >
          <LogOut size={17} />

          <span>
            Logout
          </span>
        </button>
      </aside>

      {/* =====================
          MAIN CONTENT
      ===================== */}

      <main className="role-main">

        {/* TOP BAR */}
        <header className="role-topbar">
          <div>
            <span className="role-eyebrow">
              STUDENT PORTAL
            </span>

            <h1>
              {
                sections.find(
                  ([id]) =>
                    id ===
                    activeSection
                )?.[1]
              }
            </h1>
          </div>

          <span className="role-date">
            {new Date().toLocaleDateString(
              undefined,
              {
                weekday:
                  "long",
                month:
                  "long",
                day:
                  "numeric",
              }
            )}
          </span>
        </header>

        {/* =====================
            ACTIVE CONTENT ONLY
        ===================== */}

        <div
          className="role-content"
          data-active-section={
            activeSection
          }
        >
          {renderActiveSection()}
        </div>

      </main>
    </div>
  );
}