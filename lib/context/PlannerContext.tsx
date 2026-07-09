"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  EMPTY_PLANNER_ANSWERS,
  type PlannerAnswers,
  type PlannerPlan
} from "@/features/planner/types";
import {
  buildStructuredPlan,
  generatePlannerRecommendation
} from "@/features/planner/recommendation";

const STORAGE_KEY = "abseco_unified_planner";

type PlannerContextValue = {
  plan: PlannerPlan;
  setStep: (step: number) => void;
  updateAnswers: (answers: Partial<PlannerAnswers>) => void;
  updateFamily: (family: Partial<PlannerAnswers["family"]>) => void;
  toggleListValue: (key: "rooms" | "lifestyles" | "goals", value: string) => void;
  completePlan: () => PlannerPlan;
  saveDraft: () => Promise<void>;
  resetPlan: () => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

function createInitialPlan(): PlannerPlan {
  return {
    status: "draft",
    currentStep: 1,
    answers: { ...EMPTY_PLANNER_ANSWERS, family: {} }
  };
}

function loadPlan(): PlannerPlan {
  if (typeof window === "undefined") return createInitialPlan();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : createInitialPlan();
  } catch {
    return createInitialPlan();
  }
}

function persistPlan(plan: PlannerPlan) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlannerPlan>(createInitialPlan);

  useEffect(() => {
    setPlan(loadPlan());
  }, []);

  useEffect(() => {
    persistPlan(plan);
  }, [plan]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localPlan = loadPlan();
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : null))
      .then((session) => {
        if (!session?.user) return;
        return fetch("/api/planner/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(localPlan)
        }).then((response) => (response.ok ? response.json() : null));
      })
      .then((result) => {
        if (result?.plan?._id && !localPlan.id) {
          const synced = { ...localPlan, id: result.plan._id };
          setPlan(synced);
          persistPlan(synced);
        }
      })
      .catch(() => {});
  }, []);

  const setStep = useCallback((step: number) => {
    setPlan((prev) => ({ ...prev, currentStep: Math.max(1, Math.min(7, step)) }));
  }, []);

  const updateAnswers = useCallback((answers: Partial<PlannerAnswers>) => {
    setPlan((prev) => ({
      ...prev,
      answers: { ...prev.answers, ...answers }
    }));
  }, []);

  const updateFamily = useCallback((family: Partial<PlannerAnswers["family"]>) => {
    setPlan((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        family: { ...prev.answers.family, ...family }
      }
    }));
  }, []);

  const toggleListValue = useCallback((key: "rooms" | "lifestyles" | "goals", value: string) => {
    setPlan((prev) => {
      const current = prev.answers[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, answers: { ...prev.answers, [key]: next } };
    });
  }, []);

  const completePlan = useCallback(() => {
    const recommendation = generatePlannerRecommendation(plan.answers);
    const structuredPlan = buildStructuredPlan(plan.answers, recommendation);
    const completed: PlannerPlan = {
      ...plan,
      status: "completed",
      recommendation,
      structuredPlan
    };
    setPlan(completed);
    persistPlan(completed);
    return completed;
  }, [plan]);

  const saveDraft = useCallback(async () => {
    const recommendation = plan.recommendation || generatePlannerRecommendation(plan.answers);
    const structuredPlan = plan.structuredPlan || buildStructuredPlan(plan.answers, recommendation);
    const draft = { ...plan, recommendation, structuredPlan };
    persistPlan(draft);
    const session = await fetch("/api/auth/session").then((r) => (r.ok ? r.json() : null)).catch(() => null);
    if (!session?.user) return;
    const result = await fetch("/api/planner/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    }).then((response) => (response.ok ? response.json() : null)).catch(() => null);
    if (result?.plan?._id && !draft.id) {
      const synced = { ...draft, id: result.plan._id };
      setPlan(synced);
      persistPlan(synced);
    }
  }, [plan]);

  const resetPlan = useCallback(() => {
    const initial = createInitialPlan();
    setPlan(initial);
    persistPlan(initial);
  }, []);

  const value = useMemo(
    () => ({
      plan,
      setStep,
      updateAnswers,
      updateFamily,
      toggleListValue,
      completePlan,
      saveDraft,
      resetPlan
    }),
    [plan, setStep, updateAnswers, updateFamily, toggleListValue, completePlan, saveDraft, resetPlan]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error("usePlanner must be used within PlannerProvider");
  return context;
}
