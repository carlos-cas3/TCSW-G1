import StatusDropdown from "../components/StatusDropdown";

export const createStatusColumn = ({
  key = "status",
  label = "Estado",
  variant = "badge",
  onChange,
  options,
  labels,
  ...config
}) => ({
  key,
  label,
  ...config,
  render: (row) => (
    <StatusDropdown
      variant={variant}
      value={row[key]}
      onChange={(newValue) => onChange?.(row, newValue)}
      options={options}
      labels={labels}
    />
  ),
});
