"use client";

import { cn } from "@/lib/utils";

interface DayCheckboxGridProps {
  prefix: string;
  values: Record<string, number>;
  onChange: (key: string, val: number) => void;
}

const DAYS = [1, 2, 3, 4, 5, 6];

export function DayCheckboxGrid({ prefix, values, onChange }: DayCheckboxGridProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5 my-2.5 max-w-[320px]">
      {DAYS.map((d) => {
        const key = `${prefix}_h${d}`;
        const checked = values[key] === 1;
        return (
          <label
            key={key}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1.5 px-1 border rounded-md cursor-pointer transition-all",
              checked
                ? "bg-blue-50 border-blue-500"
                : "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-500"
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(key, e.target.checked ? 1 : 0)}
              className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
            />
            <span
              className={cn(
                "text-[11px] font-semibold",
                checked ? "text-blue-600" : "text-gray-500"
              )}
            >
              H{d}
            </span>
          </label>
        );
      })}
    </div>
  );
}
