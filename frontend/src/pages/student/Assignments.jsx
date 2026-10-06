import { ClipboardList } from "lucide-react";

export default function Assignments({
  assignments = [],
}) {
  return (
    <section className="role-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            COURSE WORK
          </span>

          <h2>Assignments</h2>
        </div>

        <ClipboardList size={21} />
      </div>

      {assignments.length ? (
        <div className="role-list">
          {assignments.map(
            (item, index) => (
              <article
                className="role-list-item"
                key={
                  item.id || index
                }
              >
                <span className="role-list-date">
                  <ClipboardList
                    size={15}
                  />
                </span>

                <span className="role-list-copy">
                  <strong>
                    {item.title ||
                      item.name ||
                      "Assignment"}
                  </strong>

                  <small>
                    {item.subject ||
                      item.subject_name ||
                      "Subject"}
                  </small>
                </span>

                <span className="role-list-meta">
                  {item.due_date ||
                    item.deadline ||
                    "No deadline"}
                </span>
              </article>
            )
          )}
        </div>
      ) : (
        <p className="role-empty">
          No assignments available.
        </p>
      )}
    </section>
  );
}