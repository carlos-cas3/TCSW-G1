import HomeIcon from "../../../assets/home-icon.svg?react";
import VendorsIcon from "../../../assets/vendors-icon.svg?react";
import BranchesIcon from "../../../assets/branches-icon.svg?react";
import CatalogIcon from "../../../assets/catalog-icon.svg?react";
import AnalyticsIcon from "../../../assets/analytics-icon.svg?react";

const allMenuItems = [
    { path: "/admin", 
      label: "Dashboard", 
      icon: HomeIcon, 
      roles: [1] 
    },
    { path: "/admin/vendors",
      label: "Vendors",
      icon: VendorsIcon,
      roles: [1]
    },
    {
        path: "/admin/branches",
        label: "Branches",
        icon: BranchesIcon,
        roles: [1],
    },
    { path: "/admin/catalog", label: "Catalog", icon: CatalogIcon, roles: [1] },
    {
        path: "/admin/analytics",
        label: "Analytics",
        icon: AnalyticsIcon,
        roles: [1],
    },
    { path: "/dashboard",
      label: "Dashboard",
      icon: HomeIcon,
      roles: [2]
    },
    {
        path: "/dashboard/catalog",
        label: "Catalog",
        icon: CatalogIcon,
        roles: [2],
    },
];

export const getMenuByRole = (roleId) =>
    allMenuItems.filter((item) => item.roles.includes(roleId));

export default allMenuItems;