const leadRows = [
  { name: "Aarav K.", location: "Dubai Hills", package: "AI Villa", status: "Qualified" },
  { name: "Noah M.", location: "Business Bay", package: "Security Home", status: "Proposal Requested" },
  { name: "Lina A.", location: "Mirdif", package: "Luxury Home", status: "Site Visit Pending" }
];

export default function SalesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Sales Dashboard</h1>
      <p className="text-sm text-slate-300">
        Track qualified leads, proposal requests, and site visit scheduling.
      </p>
      <div className="grid gap-3">
        {leadRows.map((lead) => (
          <div key={lead.name} className="glass-card p-4">
            <p className="font-semibold">{lead.name}</p>
            <p className="mt-1 text-sm text-slate-300">
              {lead.location} - {lead.package}
            </p>
            <p className="mt-1 text-xs text-blue-300">{lead.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
