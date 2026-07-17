import TableActions from "../components/TableActions";

export const createActionsColumn = ({
  key = "actions",
  label = "Acciones",
  actions,
  handlers,
  ...config
}) => ({
  key,
  label,
  ...config,
  render: (row) => (
    <TableActions
      show={actions}
      onView={() => handlers?.onView?.(row)}
      onEdit={() => handlers?.onEdit?.(row)}
      onDelete={() => handlers?.onDelete?.(row)}
    />
  ),
});
