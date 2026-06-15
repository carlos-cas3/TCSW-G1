export const createMoneyColumn = ({ key, label, ...config }) => ({
  key,
  label,
  ...config,
  render: (row) => {
    const value = row[key];
    if (value == null) return "—";
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  },
});
