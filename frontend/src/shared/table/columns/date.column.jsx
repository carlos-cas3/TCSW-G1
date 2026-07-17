export const createDateColumn = ({ key, label, ...config }) => ({
  key,
  label,
  ...config,
  render: (row) => {
    if (!row[key]) return "—";
    return new Date(row[key]).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },
});
