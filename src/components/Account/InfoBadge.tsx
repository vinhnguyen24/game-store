"use client";

import { ReactNode } from "react";

/**
 * Reusable badge for key metrics (VIP, Kills, …)
 */
interface InfoBadgeProps {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  /** Tailwind background‑color class – mặc định bg‑gray‑100 */
  color?: string;
}

const InfoBadge = ({
  icon,
  label,
  value,
  color = "bg-gray-100",
}: InfoBadgeProps) => (
  <div
    className={`flex items-center ${color} p-3 rounded-md text-sm text-gray-700`}
  >
    <span className="text-lg mr-2">{icon}</span>
    <span>
      {label} <span className="font-bold">{value}</span>
    </span>
  </div>
);

export default InfoBadge;
