"use client";

import { useEffect, useState } from "react";

type Notification = {
  _id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function load() {
    fetch("/api/customer/notifications")
      .then((response) => response.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateNotification(id: string, payload: { read?: boolean; archived?: boolean }) {
    await fetch("/api/customer/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload })
    }).catch(() => {});
    load();
  }

  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white">Notifications</h1>
        <p className="mt-1 text-sm text-slate-400">{unread} unread customer updates.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification._id} className="glass-card flex flex-wrap items-start justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-semibold text-white">{notification.title}</p>
              <p className="mt-1 text-xs text-slate-400">{notification.body}</p>
              <p className="mt-2 text-xs text-slate-600">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => updateNotification(notification._id, { read: !notification.read })} className="rounded-full border border-white/20 px-4 py-2 text-slate-200">
                {notification.read ? "Unread" : "Read"}
              </button>
              <button onClick={() => updateNotification(notification._id, { archived: true })} className="rounded-full border border-white/20 px-4 py-2 text-slate-200">
                Archive
              </button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="glass-card p-5 text-sm text-slate-400">No notifications yet.</p>}
      </div>
    </section>
  );
}
