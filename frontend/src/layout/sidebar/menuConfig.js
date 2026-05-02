import HomeIcon from "../../assets/home-icon.svg?react";
import VendorsIcon from "../../assets/vendors-icon.svg?react";
import BranchesIcon from "../../assets/branches-icon.svg?react";
import CatalogIcon from "../../assets/catalog-icon.svg?react";
import AnalyticsIcon from "../../assets/analytics-icon.svg?react";

const menuConfig = [
  { path: "/", label: "Dashboard", icon: HomeIcon },
  { path: "/vendors", label: "Vendors", icon: VendorsIcon },
  { path: "/branches", label: "Branches", icon: BranchesIcon },
  { path: "/catalog", label: "Catalog", icon: CatalogIcon },
  { path: "/analytics", label: "Analytics", icon: AnalyticsIcon },
];

export default menuConfig;