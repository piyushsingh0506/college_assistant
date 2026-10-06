import { Clock3 } from "lucide-react";

export default function Replacements({
  replacements = [],
}) {
  return (
    <section className="role-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            LECTURE MANAGEMENT
          </span>

          <h2>
            Lecture Replacements
          </h2>
        </div>

        <Clock3 size={21} />
      </div>

      {replacements.length ? (
        <div className="role-table-wrap">
          <table className="role-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Original Faculty</th>
                <th>Replacement Faculty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>

            <tbody>
              {replacements.map(
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
                      {item.original_faculty ||
                        item.original_faculty_name ||
                        "—"}
                    </td>

                    <td>
                      {item.replacement_faculty ||
                        item.replacement_faculty_name ||
                        "—"}
                    </td>

                    <td>
                      {item.date ||
                        item.replacement_date ||
                        "—"}
                    </td>

                    <td>
                      {item.time ||
                        item.start_time ||
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
          No lecture replacements are
          currently scheduled.
        </p>
      )}
    </section>
  );
}