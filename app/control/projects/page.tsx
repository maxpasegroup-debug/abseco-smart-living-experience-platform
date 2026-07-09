"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Project = {
  _id: string;
  project_number: string;
  customer_id?: string;
  order_id?: string;
  sales_executive?: string;
  project_manager?: string;
  primary_engineer_id?: string;
  priority: string;
  status: string;
  completion_percentage: number;
  expected_completion?: string;
  updated_at: string;
};

type Engineer = {
  _id: string;
  name: string;
  role?: string;
  region: string;
  skills?: string[];
  availability_status?: string;
};

type Analytics = {
  totalProjects: number;
  completedProjects: number;
  delayedProjects: number;
  averageCompletionTimeDays: number;
  averageCompletionPercentage: number;
  averageCustomerRating: number;
  averageQaScore: number;
};

export default function ControlProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>();
  const [orderId, setOrderId] = useState("");
  const [engineerName, setEngineerName] = useState("");
  const [region, setRegion] = useState("");

  function load() {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects || []);
        setEngineers(data.engineers || []);
        setAnalytics(data.analytics);
      })
      .catch(() => {
        setProjects([]);
        setEngineers([]);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orderId.trim()) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId.trim() })
    });
    setOrderId("");
    load();
  }

  async function createEngineer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!engineerName.trim()) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_engineer", name: engineerName.trim(), region: region || "Default", skills: [] })
    });
    setEngineerName("");
    setRegion("");
    load();
  }

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">Project Center</h1>
        <p className="mt-1 text-sm text-slate-400">
          Smart project execution, installation progress, engineers, QA, and customer handover.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Metric label="Projects" value={analytics?.totalProjects || 0} />
        <Metric label="Completed" value={analytics?.completedProjects || 0} />
        <Metric label="Delayed" value={analytics?.delayedProjects || 0} />
        <Metric label="Avg QA" value={`${analytics?.averageQaScore || 0}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={createProject} className="glass-card space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">Create Project From Paid Order</h2>
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Order ID"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          />
          <button className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white" type="submit">
            Create Project
          </button>
        </form>

        <form onSubmit={createEngineer} className="glass-card space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">Engineer Management</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={engineerName}
              onChange={(event) => setEngineerName(event.target.value)}
              placeholder="Engineer name"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            />
            <input
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="Region"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200" type="submit">
            Save Engineer
          </button>
        </form>
      </div>

      <div className="glass-card overflow-x-auto p-5">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2">Project</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Progress</th>
              <th className="pb-2">Priority</th>
              <th className="pb-2">Manager</th>
              <th className="pb-2">Expected</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="py-3">
                  <p className="font-medium text-white">{project.project_number}</p>
                  <p className="text-xs text-slate-500">{project.order_id || "No order link"}</p>
                </td>
                <td className="py-3 text-slate-300">{project.status}</td>
                <td className="py-3 text-slate-300">{project.completion_percentage}%</td>
                <td className="py-3 text-slate-300">{project.priority}</td>
                <td className="py-3 text-slate-300">{project.project_manager || project.sales_executive || "-"}</td>
                <td className="py-3 text-slate-300">{project.expected_completion ? new Date(project.expected_completion).toLocaleDateString() : "-"}</td>
                <td className="py-3">
                  <Link href={`/control/projects/${project._id}`} className="text-xs font-semibold text-[#FF6A00]">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No projects yet.</p>}
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Engineers</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {engineers.map((engineer) => (
            <p key={engineer._id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <span className="font-semibold text-white">{engineer.name}</span><br />
              {engineer.region} | {engineer.availability_status || "available"}<br />
              {(engineer.skills || []).join(", ") || "Skills pending"}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
