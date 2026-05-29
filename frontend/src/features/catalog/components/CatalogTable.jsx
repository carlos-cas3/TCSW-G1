import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

export default function CatalogTable({
    products,
    onDelete,
    onEdit,
    onView,
}) {

    if (!products.length) {
        return (
            <div className="p-10 text-center text-gray-500">
                No products found
            </div>
        );
    }

    return (
        <table className="w-full">

            <thead className="bg-gray-50 border-b">
                <tr className="text-left text-sm text-gray-500">
                    <th className="p-4">PRODUCT</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">BRAND</th>
                    <th className="p-4">PRICE</th>
                    <th className="p-4">STOCK</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTIONS</th>
                </tr>
            </thead>

            <tbody>
                {products.map((product) => {

                    const productInfo =
                        product.products || product;

                    const productName =
                        productInfo.product_name || "Sin nombre";

                    const productBrand =
                        productInfo.product_brand || "-";

                    const productDescription =
                        productInfo.product_description ||
                        product.description ||
                        "";

                    const imageUrl =
                        productInfo.image_url ||
                        "https://placehold.co/60x60";

                    const categoryName =
                        productInfo.categories?.category_name ||
                        product.category_name ||
                        "-";

                    const status =
                        product.status ||
                        product.product_status ||
                        "INACTIVE";

                    return (
                        <tr
                            key={
                                product.vendor_product_id ||
                                product.product_id
                            }
                            className="border-b hover:bg-gray-50 transition"
                        >

                            <td className="p-4">
                                <div className="flex items-center gap-4">

                                    <img
                                        src={imageUrl}
                                        alt={productName}
                                        className="w-14 h-14 rounded-xl object-cover border"
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {productName}
                                        </p>

                                        <p className="text-sm text-gray-500 line-clamp-1">
                                            {productDescription}
                                        </p>
                                    </div>

                                </div>
                            </td>

                            <td className="p-4 text-gray-700">
                                {categoryName}
                            </td>

                            <td className="p-4 text-gray-700">
                                {productBrand}
                            </td>

                            <td className="p-4 text-gray-700">
                                {product.price
                                    ? `S/ ${product.price}`
                                    : "-"}
                            </td>

                            <td className="p-4 text-gray-700">
                                {product.stock ?? "-"}
                            </td>

                            <td className="p-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {status}
                                </span>
                            </td>

                            <td className="p-4">
                                <div className="flex items-center justify-end gap-4">

                                    <button
                                        onClick={() => onView(product)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        onClick={() => onEdit(product)}
                                        className="text-yellow-600 hover:text-yellow-800"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            onDelete(
                                                product.vendor_product_id ||
                                                product.product_id
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>
                            </td>

                        </tr>
                    );
                })}
            </tbody>

        </table>
    );
}