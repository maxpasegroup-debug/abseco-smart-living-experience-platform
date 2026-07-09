"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Project = {
  _id: string;
  project_number: string;
  customer_id?: string;
  lead_id?: string;
  planner_plan_id?: string;
  proposal_id?: string;
  order_id?: string;
  sales_executive?: string;
  project_manager?: string;
  primary_engineer_id?: string;
  assistant_engineer_ids?: string[];
  priority: string;
  status: string;
  completion_percentage: number;
  expected_start?: string;
  expected_completion?: string;
  actual_completion?: string;
  remarks?: string;
  stages: Array<{ stage: string; timestamp: string; updated_by?: string; remarks?: string }>;
  engineer_history: Array<{ engineer_name?: string; role?: string; action: string; timestamp: string; remarks?: string }>;
  rooms: Array<{ room: string; status: string; completion_percentage: number; remarks?: string }>;
  checklist: Array<{ key: string; label: string; status: string; remarks?: string }>;
  photos: Array<{ url: string; room?: string; category: string; caption?: string; uploaded_at: string }>;
  qa: { checklist: Array<{ key: string; label: string; status: string; remarks?: string }>; score?: number; status: string; remarks?: string };
  customer_approval: { status: string; comments?: string; rating?: number; digital_acceptance?: boolean };
  handover: { certificate_number?: string; ready_for_warranty: boolean; project_summary?: string };
};

type Engineer = { _id: string; name: string; role?: string; region?: string };

const stages = [
  "project_created",
  "planning",
  "material_ordered",
  "material_ready",
  "engineer_assigned",
  "visit_scheduled",
  "visit_completed",
  "installation_started",
  "lighting",
  "curtains",
  "security",
  "automation",
  "testing",
  "qa",
  "customer_review",
  "completed",
  "handover",
  "cancelled"
];

const roomStatuses = ["pending", "in_progress", "completed", "quality_passed", "customer_approved"];
const itemStatuses = ["pending", "passed", "failed", "not_applicable"];

export default function ControlProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project>();
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [stage, setStage] = useState("planning");
  const [remarks, setRemarks] = useState("");
  const [engineerId, setEngineerId] = useState("");
  const [assignmentRole, setAssignmentRole] = useState<"primary" | "assistant" | "project_manager">("primary");
  const [room, setRoom] = useState("");
  const [roomStatus, setRoomStatus] = useState("in_progress");
  const [photoUrl, setPhotoUrl] = useState("");

  const load = useCallback(() => {
    if (!params?.id) return;
    Promise.all([
      fetch(`/api/projects/${params.id}`).then((response) => response.json()),
      fetch("/api/projects").then((response) => response.json())
    ])
      .then(([details, list]) => {
        setProject(details.project);
        setEngineers(list.engineers || []);
        if (details.project?.status) setStage(details.project.status);
        if (details.project?.rooms?.[0]) setRoom(details.project.rooms[0].room);
      })
      .catch(() => setProject(undefined));
  }, [params?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(body: Record<string, unknown>) {
    if (!params?.id) return;
    await fetch(`/api/projects/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setRemarks("");
    load();
  }

  if (!project) {
    return <section className="glass-card p-5 text-sm text-slate-400">Loading project...</section>;
  }

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-semibold">{project.project_number}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Customer, planner, proposal, order, engineers, rooms, checklist, photos, timeline, QA, and handover.
        </p>
      </div>

      <div className="glass-card space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{project.status}</h2>
            <p className="text-xs text-slate-500">{project.order_id || "No order"} | {project.proposal_id || "No proposal"}</p>
          </div>
          <span className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white">{project.completion_percentage}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#FF6A00]" style={{ width: `${project.completion_percentage}%` }} />
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-4">
          <p><span className="text-slate-500">Customer</span><br />{project.customer_id || "-"}</p>
          <p><span className="text-slate-500">Sales</span><br />{project.sales_executive || "-"}</p>
          <p><span className="text-slate-500">Manager</span><br />{project.project_manager || "-"}</p>
          <p><span className="text-slate-500">Expected</span><br />{project.expected_completion ? new Date(project.expected_completion).toLocaleDateString() : "-"}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            patch({ action: "stage", status: stage, remarks });
          }}
          className="glass-card space-y-3 p-5"
        >
          <h2 className="text-sm font-semibold text-white">Installation Pipeline</h2>
          <select value={stage} onChange={(event) => setStage(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white">
            {stages.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Remarks" className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
          <button className="rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white" type="submit">Update Stage</button>
        </form>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            patch({ action: "assign_engineer", engineer_id: engineerId, assignment_role: assignmentRole, remarks });
          }}
          className="glass-card space-y-3 p-5"
        >
          <h2 className="text-sm font-semibold text-white">Engineer Assignment</h2>
          <select value={engineerId} onChange={(event) => setEngineerId(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white">
            <option value="">Select engineer</option>
            {engineers.map((engineer) => <option key={engineer._id} value={engineer._id}>{engineer.name}</option>)}
          </select>
          <select value={assignmentRole} onChange={(event) => setAssignmentRole(event.target.value as "primary" | "assistant" | "project_manager")} className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white">
            <option value="primary">Primary Engineer</option>
            <option value="assistant">Assistant Engineer</option>
            <option value="project_manager">Project Manager</option>
          </select>
          <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200" type="submit">Assign</button>
        </form>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            patch({ action: "photo", url: photoUrl || "/placeholder-project-photo.jpg", category: "during", room });
            setPhotoUrl("");
          }}
          className="glass-card space-y-3 p-5"
        >
          <h2 className="text-sm font-semibold text-white">Photo Documentation</h2>
          <input value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} placeholder="Photo URL placeholder" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none" />
          <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200" type="submit">Add Photo</button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Room Progress</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                patch({ action: "room", room, status: roomStatus });
              }}
              className="flex flex-wrap gap-2"
            >
              <select value={room} onChange={(event) => setRoom(event.target.value)} className="rounded-full border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white">
                {project.rooms.map((item) => <option key={item.room} value={item.room}>{item.room}</option>)}
              </select>
              <select value={roomStatus} onChange={(event) => setRoomStatus(event.target.value)} className="rounded-full border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white">
                {roomStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button className="rounded-full bg-[#FF6A00] px-3 py-2 text-xs font-semibold text-white" type="submit">Save</button>
            </form>
          </div>
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            {project.rooms.map((item) => (
              <p key={item.room} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                {item.room} | {item.status} | {item.completion_percentage}%
              </p>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Installation Checklist</h2>
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            {project.checklist.map((item) => (
              <div key={item.key} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span>{item.label} | {item.status}</span>
                <select
                  value={item.status}
                  onChange={(event) => patch({ action: "checklist", key: item.key, status: event.target.value })}
                  className="rounded-full border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white"
                >
                  {itemStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">QA</h2>
          <p className="mt-2 text-xs text-slate-300">Status: {project.qa.status} | Score: {project.qa.score || 0}%</p>
          <button
            onClick={() => patch({ action: "qa", checklist: project.qa.checklist.map((item) => ({ key: item.key, status: "passed" })) })}
            className="mt-4 rounded-full bg-[#FF6A00] px-4 py-2 text-xs font-semibold text-white"
            type="button"
          >
            Mark QA Passed
          </button>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Customer Approval</h2>
          <p className="mt-2 text-xs text-slate-300">{project.customer_approval.status}</p>
          <p className="mt-1 text-xs text-slate-500">{project.customer_approval.comments || "No comments yet."}</p>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white">Handover</h2>
          <p className="mt-2 text-xs text-slate-300">{project.handover.certificate_number || "Not generated"}</p>
          <button onClick={() => patch({ action: "handover" })} className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200" type="button">
            Generate Handover
          </button>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white">Project Timeline</h2>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          {project.stages.slice().reverse().map((item) => (
            <p key={`${item.stage}-${item.timestamp}`}>{new Date(item.timestamp).toLocaleString()} | {item.stage} | {item.remarks || "-"}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
