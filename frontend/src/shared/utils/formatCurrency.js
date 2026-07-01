export const formatPEN = (value) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
    }).format(value);
};
