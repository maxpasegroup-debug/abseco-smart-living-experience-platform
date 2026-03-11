const modules = [
  "Lead management",
  "Partner network",
  "Automation control",
  "Content management",
  "Analytics"
];

export default function AdminPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">BGOS Admin Panel</h1>
      <p className="text-sm text-slate-300">
        Business Growth Operating System modules for backend operations.
      </p>
      <div className="grid gap-3">
        {modules.map((module) => (
          <div key={module} className="glass-card p-4">
            <p className="font-medium">{module}</p>
          </div>
        ))}
      </div>
      <a href="/admin/partners" className="glass-card block p-4 text-blue-300">
        Open Partner Engine Dashboard →
      </a>
      <a href="/admin/whatsapp" className="glass-card block p-4 text-blue-300">
        ABSECO WhatsApp Sales Engine →
      </a>
    </section>
  );
}
