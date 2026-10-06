import { FlaskConical } from "lucide-react";

export default function Labs({
  labs = [],
}) {
  return (
    <section className="role-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            CAMPUS FACILITIES
          </span>

          <h2>
            Laboratory Availability
          </h2>
        </div>

        <FlaskConical size={21} />
      </div>

      {labs.length ? (
        <div className="role-list">
          {labs.map((lab, index) => {
            const status =
              String(
                lab.status ||
                  lab.availability ||
                  "Available"
              ).toLowerCase();

            const available =
              !status.includes("busy") &&
              !status.includes(
                "unavailable"
              );

            return (
              <article
                className="role-list-item"
                key={
                  lab.id || index
                }
              >
                <span className="role-list-date">
                  <FlaskConical
                    size={16}
                  />
                </span>

                <span className="role-list-copy">
                  <strong>
                    {lab.name ||
                      lab.lab_name ||
                      "Laboratory"}
                  </strong>

                  <small>
                    {lab.room ||
                      lab.room_no ||
                      lab.location ||
                      "Location —"}
                  </small>
                </span>

                <span
                  className={`student-lab-status ${
                    available
                      ? "is-available"
                      : "is-busy"
                  }`}
                >
                  {available
                    ? "Available"
                    : "Busy"}
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="role-empty">
          No lab information available.
        </p>
      )}
    </section>
  );
}