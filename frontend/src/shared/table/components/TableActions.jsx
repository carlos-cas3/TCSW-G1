import { Eye, Pencil, Trash2 } from "lucide-react";

const ACTION_PRESETS = {
  view: { icon: Eye, label: "Ver", color: "blue" },
  edit: { icon: Pencil, label: "Editar", color: "yellow" },
  delete: { icon: Trash2, label: "Eliminar", color: "red" },
};

const COLOR_STYLES = {
  blue: {
    base: "text-blue-600",
    hover: "hover:text-blue-800 hover:bg-blue-50",
  },
  yellow: {
    base: "text-yellow-600",
    hover: "hover:text-yellow-800 hover:bg-yellow-50",
  },
  red: {
    base: "text-red-600",
    hover: "hover:text-red-800 hover:bg-red-50",
  },
  gray: {
    base: "text-gray-600",
    hover: "hover:text-gray-900 hover:bg-gray-100",
  },
};

const noop = () => {};

export default function TableActions({
  show,
  actions,
  onView,
  onEdit,
  onDelete,
  size = "sm",
  disabled = false,
}) {
  const resolvedActions = show
    ? show.map((key) => {
        const preset = ACTION_PRESETS[key];
        if (!preset) return null;
        return {
          ...preset,
          onClick:
            key === "view"
              ? onView || noop
              : key === "edit"
                ? onEdit || noop
                : key === "delete"
                  ? onDelete || noop
                  : noop,
        };
      }).filter(Boolean)
    : actions;

  const iconSize = size === "sm" ? 16 : 18;

  return (
    <div className="flex gap-2">
      {resolvedActions.map((action, idx) => {
        const Icon = action.icon;
        const colorStyle = COLOR_STYLES[action.color] || COLOR_STYLES.gray;
        const isDisabled = disabled || action.disabled;

        return (
          <button
            key={idx}
            onClick={action.onClick}
            disabled={isDisabled}
            className={`p-1.5 rounded transition-colors ${colorStyle.base} ${colorStyle.hover} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={action.label}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}
    </div>
  );
}
