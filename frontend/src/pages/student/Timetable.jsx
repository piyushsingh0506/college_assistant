import { CalendarDays } from "lucide-react";

export default function Timetable({
  timetable = [],
}) {
  return (
    <section className="role-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            ACADEMIC SCHEDULE
          </span>

          <h2>My Timetable</h2>
        </div>

        <CalendarDays size={21} />
      </div>

      {timetable.length ? (
        <div className="role-table-wrap">
          <table className="role-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Room</th>
              </tr>
            </thead>

            <tbody>
              {timetable.map(
                (item, index) => (
                  <tr
                    key={
                      item.id || index
                    }
                  >
                    <td>
                      {item.day ||
                        item.day_name ||
                        "—"}
                    </td>

                    <td>
                      {item.time ||
                        item.start_time ||
                        "—"}
                    </td>

                    <td>
                      <strong>
                        {item.subject ||
                          item.subject_name ||
                          "Subject"}
                      </strong>
                    </td>

                    <td>
                      {item.faculty ||
                        item.faculty_name ||
                        item.teacher ||
                        "—"}
                    </td>

                    <td>
                      {item.room ||
                        item.room_no ||
                        "—"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="role-empty">
          No timetable available.
        </p>
      )}
    </section>
  );
}