import { CheckCircle2 } from "lucide-react";
import { getAverageAttendance } from "./attendanceMetrics";

export default function Attendance({
  attendance = [],
}) {
  const average = getAverageAttendance(attendance);

  return (
    <>
      <section className="role-metrics">
        <article className="role-metric">
          <span className="metric-icon metric-green">
            <CheckCircle2 size={19} />
          </span>

          <div>
            <small>
              Average Attendance
            </small>

            <strong>
              {average === null
                ? "—"
                : `${average}%`}
            </strong>

            <span>
              Across all subjects
            </span>
          </div>
        </article>

        <article className="role-metric">
          <span className="metric-icon metric-blue">
            <CheckCircle2 size={19} />
          </span>

          <div>
            <small>Subjects</small>

            <strong>
              {attendance.length}
            </strong>

            <span>
              Attendance records
            </span>
          </div>
        </article>
      </section>

      <section className="role-panel">
        <div className="role-panel-heading">
          <div>
            <span className="role-eyebrow">
              ACADEMIC RECORD
            </span>

            <h2>Attendance Details</h2>
          </div>

          <CheckCircle2 size={21} />
        </div>

        {attendance.length ? (
          <div className="role-table-wrap">
            <table className="role-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Present</th>
                  <th>Total</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map(
                  (item, index) => (
                    <tr
                      key={
                        item.id || index
                      }
                    >
                      <td>
                        <strong>
                          {item.subject ||
                            item.subject_name ||
                            "Subject"}
                        </strong>
                      </td>

                      <td>
                        {item.present ??
                          item.present_count ??
                          "—"}
                      </td>

                      <td>
                        {item.total ??
                          item.total_classes ??
                          "—"}
                      </td>

                      <td>
                        <span className="role-grade">
                          {item.percentage
                            ? `${item.percentage}%`
                            : "—"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="role-empty">
            No attendance records.
          </p>
        )}
      </section>
    </>
  );
}