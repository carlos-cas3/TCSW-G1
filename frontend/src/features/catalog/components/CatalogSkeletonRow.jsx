export default function CatalogSkeletonRow({ mode }) {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-xl" />
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
      {mode === "vendor" && (
        <>
          <td className="px-4 py-4">
            <div className="h-4 bg-gray-200 rounded w-16" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 bg-gray-200 rounded w-12" />
          </td>
        </>
      )}
      <td className="px-4 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </td>
      <td className="px-4 py-4">
        <div className="flex justify-end gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </td>
    </tr>
  );
}
