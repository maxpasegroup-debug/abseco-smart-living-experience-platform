const blocks = [
  "Saved designs",
  "Proposals",
  "Site visits",
  "Account details"
];

export default function ProfilePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">My Profile</h1>
      <p className="text-sm text-slate-300">
        Your dashboard keeps your saved plans and project requests in one place.
      </p>
      <div className="grid gap-3">
        {blocks.map((item) => (
          <div key={item} className="glass-card p-4">
            <p className="font-medium">{item}</p>
            <p className="mt-1 text-sm text-slate-400">No records yet.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
