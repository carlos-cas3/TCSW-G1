import { Users, UserCheck, UserCog } from "lucide-react";

export const ROLE_MAP = {
  3: "Vendedor",
  4: "Supervisor",
};

export const ROLE_OPTIONS = [
  { value: 3, label: "Vendedor" },
  { value: 4, label: "Supervisor" },
];

export const ROLE_FILTER_OPTIONS = [
  { value: "3", label: "Vendedor" },
  { value: "4", label: "Supervisor" },
];

export const STATS_CONFIG = [
  { label: "Total Staff", valueKey: "total", icon: Users, color: "blue" },
  { label: "Vendedores", valueKey: "sellers", icon: UserCheck, color: "green" },
  { label: "Supervisores", valueKey: "supervisors", icon: UserCog, color: "purple" },
];
