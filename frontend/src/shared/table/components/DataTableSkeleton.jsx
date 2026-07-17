export default function DataTableSkeleton({ columns, rows = 5 }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {columns.map((col, j) => (
            <td key={j} className="px-4 py-4 whitespace-nowrap">
              {col.skeleton || (
                <div className="h-4 bg-gray-200 rounded" style={{ width: col.skeletonWidth || "80%" }} />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
