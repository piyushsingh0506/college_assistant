import { BookOpen } from "lucide-react";

export default function Exams({
  exams = [],
}) {
  return (
    <section className="role-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            EXAMINATION
          </span>

          <h2>Exam Schedule</h2>
        </div>

        <BookOpen size={21} />
      </div>

      {exams.length ? (
        <div className="role-table-wrap">
          <table className="role-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>

            <tbody>
              {exams.map(
                (exam, index) => (
                  <tr
                    key={
                      exam.id || index
                    }
                  >
                    <td>
                      <strong>
                        {exam.subject ||
                          exam.subject_name ||
                          "Subject"}
                      </strong>
                    </td>

                    <td>
                      {exam.exam_type ||
                        exam.type ||
                        "Exam"}
                    </td>

                    <td>
                      {exam.date ||
                        exam.exam_date ||
                        "—"}
                    </td>

                    <td>
                      {exam.time ||
                        exam.start_time ||
                        "—"}
                    </td>

                    <td>
                      {exam.room ||
                        exam.room_no ||
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
          No exams scheduled.
        </p>
      )}
    </section>
  );
}