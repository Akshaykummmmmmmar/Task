"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequireRole } from "@/components/RequireRole";
import { MedicineIcon, EditIcon, TrashIcon } from "@/components/icons";
import { fetchChildren, fetchParent } from "@/lib/mockApi";
import { cn } from "@/lib/utils";

function MedicineContent() {
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];

  const [medicines, setMedicines] = useState([""]);
  const [frequency, setFrequency] = useState("3 times");
  const [timing, setTiming] = useState("After food");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // In a real app we'd save this to a backend. For the mock we just show a success state.
  const [assignedSchedules, setAssignedSchedules] = useState<{
    medicines: string[];
    frequency: string;
    timing: string;
    notes: string;
  }[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validMedicines = medicines.filter(m => m.trim() !== "");
    if (!child || validMedicines.length === 0) return;
    
    if (editingIndex !== null) {
      const updated = [...assignedSchedules];
      updated[editingIndex] = { medicines: validMedicines, frequency, timing, notes: notes.trim() };
      setAssignedSchedules(updated);
      setEditingIndex(null);
    } else {
      setAssignedSchedules([
        ...assignedSchedules, 
        { medicines: validMedicines, frequency, timing, notes: notes.trim() }
      ]);
    }
    
    setConfirmed(true);
    setMedicines([""]);
    setFrequency("3 times");
    setTiming("After food");
    setNotes("");
    setTimeout(() => setConfirmed(false), 2500);
  }

  function handleEdit(index: number) {
    const sched = assignedSchedules[index];
    setMedicines(sched.medicines);
    setFrequency(sched.frequency);
    setTiming(sched.timing);
    setNotes(sched.notes || "");
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(index: number) {
    setAssignedSchedules(assignedSchedules.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setMedicines([""]);
      setFrequency("3 times");
      setTiming("After food");
      setNotes("");
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1);
    }
  }

  return (
    <AppShell>
      <PageHeader
        parent={parent}
        child={child}
        title="Set Medication"
        subtitle={`Manage medication schedule for ${child?.name?.split(" ")[0] ?? "your child"}.`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 flex flex-col gap-6 rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500">
              Medicines
            </label>
            <div className="flex flex-col gap-2">
              {medicines.map((med, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    required={index === 0}
                    value={med}
                    onChange={(e) => {
                      const newMeds = [...medicines];
                      newMeds[index] = e.target.value;
                      setMedicines(newMeds);
                    }}
                    placeholder="e.g. Amoxicillin 5ml"
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
                  />
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMedicines(medicines.filter((_, i) => i !== index));
                      }}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-sand-100 hover:text-stone-600 transition-colors"
                      aria-label="Remove medicine"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMedicines([...medicines, ""])}
              className="mt-3 text-sm font-medium text-sage-600 transition-colors hover:text-sage-700"
            >
              + Add another medicine
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500">
              Frequency
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["1 time", "2 times", "3 times", "4 times"].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFrequency(opt)}
                  className={cn(
                    "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                    frequency === opt
                      ? "border-sage-500 bg-sage-50 font-medium text-sage-700"
                      : "border-sand-300 bg-white text-stone-500 hover:border-stone-400"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500">
              Timing
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Before food", "After food", "With food", "Any time"].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setTiming(opt)}
                  className={cn(
                    "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                    timing === opt
                      ? "border-clay-500 bg-clay-50 font-medium text-clay-700"
                      : "border-sand-300 bg-white text-stone-500 hover:border-stone-400"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-xs font-medium text-stone-500">
              Special Instructions (Optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Take with a full glass of water"
              className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="focus-ring w-full rounded-full bg-clay-500 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-clay-600"
            >
              {editingIndex !== null ? "Save Changes" : "Save Schedule"}
            </button>
            {confirmed && (
              <p className="mt-2 text-center text-sm text-sage-700">
                {editingIndex !== null ? "Schedule updated." : "Schedule saved successfully."}
              </p>
            )}
          </div>
        </form>

        <div className="lg:col-span-3 rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft">
          <h2 className="mb-5 font-display text-lg italic text-ink">
            Current Schedules
          </h2>
          {assignedSchedules.length === 0 ? (
            <p className="text-sm text-stone-400">No schedules assigned yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {assignedSchedules.map((schedule, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 rounded-lg border border-sand-300 bg-white px-4 py-3.5"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-clay-50 text-clay-700">
                    <MedicineIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="mb-1.5">
                      {schedule.medicines.map((med, i) => (
                        <p key={i} className="text-sm font-medium text-ink">
                          • {med}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-stone-500">
                      <span className="inline-block rounded-full bg-sage-50 px-2 py-0.5 text-sage-700">
                        {schedule.frequency}
                      </span>
                      <span className="ml-2 inline-block rounded-full bg-clay-50 px-2 py-0.5 text-clay-700">
                        {schedule.timing}
                      </span>
                    </p>
                    {schedule.notes && (
                      <p className="mt-2 text-xs italic text-stone-500">
                        Note: {schedule.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(idx)}
                      className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-sand-100 hover:text-stone-600 transition-colors"
                      title="Edit"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function MedicinePage() {
  return (
    <RequireRole role="parent">
      <MedicineContent />
    </RequireRole>
  );
}
