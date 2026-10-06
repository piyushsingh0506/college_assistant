import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";

export const adminLinks = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/students", "Students", Users],
  ["/admin/faculty", "Faculty", GraduationCap],
  ["/admin/subjects", "Subjects", BookOpen],
  ["/admin/timetable", "Timetable", CalendarDays],
  ["/admin/notices", "Notices", Bell],
  ["/admin/labs", "Labs", FlaskConical],
  ["/admin/exams", "Exams", ClipboardList],
];
