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

export type PlanItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  estimatedRange?: string;
};

type SmartPlanContextValue = {
  items: PlanItem[];
  addItem: (item: PlanItem) => void;
  removeItem: (id: string) => void;
  clearPlan: () => void;
  count: number;
};

const SmartPlanContext = createContext<SmartPlanContextValue | null>(null);

const STORAGE_KEY = "abseco_smart_plan";

function loadFromStorage(): PlanItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: PlanItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function SmartPlanProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PlanItem[]>([]);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const addItem = useCallback((item: PlanItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearPlan = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearPlan,
      count: items.length
    }),
    [items, addItem, removeItem, clearPlan]
  );

  return (
    <SmartPlanContext.Provider value={value}>
      {children}
    </SmartPlanContext.Provider>
  );
}

export function useSmartPlan() {
  const ctx = useContext(SmartPlanContext);
  if (!ctx) throw new Error("useSmartPlan must be used within SmartPlanProvider");
  return ctx;
}
