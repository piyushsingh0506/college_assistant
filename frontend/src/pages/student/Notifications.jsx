import { Bell } from "lucide-react";

export default function Notifications({
  notifications = [],
  notices = [],
}) {
  const items = [
    ...notifications,
    ...notices,
  ];

  return (
    <section className="role-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            PERSONAL UPDATES
          </span>

          <h2>
            Notifications & Notices
          </h2>
        </div>

        <Bell size={21} />
      </div>

      {items.length ? (
        <div className="role-list">
          {items.map(
            (item, index) => (
              <article
                className={`role-list-item role-notification${
                  item.is_read === false
                    ? " is-unread"
                    : ""
                }`}
                key={
                  item.id || index
                }
              >
                <span className="role-notification-mark" />

                <span className="role-list-copy">
                  <strong>
                    {item.title ||
                      "Notification"}
                  </strong>

                  <small>
                    {item.message ||
                      item.description ||
                      "New college update"}
                  </small>
                </span>

                {item.is_read ===
                  false && (
                  <span className="role-unread-label">
                    New
                  </span>
                )}
              </article>
            )
          )}
        </div>
      ) : (
        <p className="role-empty">
          You're all caught up.
        </p>
      )}
    </section>
  );
}