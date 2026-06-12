import HomeIcon from "../../../assets/home-icon.svg?react";
import VendorsIcon from "../../../assets/vendors-icon.svg?react";
import BranchesIcon from "../../../assets/branches-icon.svg?react";
import CatalogIcon from "../../../assets/catalog-icon.svg?react";
import AnalyticsIcon from "../../../assets/analytics-icon.svg?react";
import SellerIcon from "../../../assets/seller-icon.svg?react";

//routes Grupo 3
import OrdersIcon from "../../../assets/orders-icon.svg?react";
import { UserCog } from "lucide-react";

const allMenuItems = [
    { path: "/admin", label: "Dashboard", icon: HomeIcon, roles: [1] },
    { path: "/admin/vendors", label: "Vendors", icon: VendorsIcon, roles: [1] },
    { path: "/admin/catalog", label: "Catalog", icon: CatalogIcon, roles: [1] },
    {
        path: "/admin/analytics",
        label: "Analytics",
        icon: AnalyticsIcon,
        roles: [1],
    },
    {
        path: "/admin/branches",
        label: "Branches Admin",
        icon: BranchesIcon,
        roles: [1],
    },
    { path: "/user", label: "Dashboard", icon: HomeIcon, roles: [2] },
    {
        path: "/user/catalog",
        label: "Catalog",
        icon: CatalogIcon,
        roles: [2],
    },
    {
        path: "/user/seller-management",
        label: "Mi Tienda",
        icon: SellerIcon,
        roles: [2],
    },
    {
        path: "/user/branches",
        label: "Branches",
        icon: BranchesIcon,
        roles: [2],
    },
    {
        path: "/user/staff",
        label: "Staff",
        icon: UserCog,
        roles: [2],
    },
    {
        path: "/admin/orders",
        label: "Orders",
        icon: OrdersIcon,
        roles: [1],
    },
    {
        path: "/user/sub-orders",
        label: "Sub-Órdenes",
        icon: OrdersIcon,
        roles: [2],
    }
    
];

export const getMenuByRole = (roleId) =>
    allMenuItems.filter((item) => item.roles.includes(roleId));

export default allMenuItems;
