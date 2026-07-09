const modules = [
  "Lead management",
  "Smart Home Planner",
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
        Open Partner Engine Dashboard
      </a>
      <a href="/admin/whatsapp" className="glass-card block p-4 text-blue-300">
        ABSECO WhatsApp Sales Engine
      </a>
      <a href="/control/planner" className="glass-card block p-4 text-blue-300">
        Smart Home Planner Submissions
      </a>
      <a href="/control/leads" className="glass-card block p-4 text-blue-300">
        Revenue Lead CRM
      </a>
      <a href="/control/revenue" className="glass-card block p-4 text-blue-300">
        Revenue Analytics
      </a>
      <a href="/control/orders" className="glass-card block p-4 text-blue-300">
        Commerce Orders
      </a>
      <a href="/control/commerce" className="glass-card block p-4 text-blue-300">
        Commerce Settings and Analytics
      </a>
    </section>
  );
}
