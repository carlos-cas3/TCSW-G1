import Layout from "../layout/Layout";
import Vendors from "../features/vendors/Vendors";


const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <h1>Dashboard</h1>
            },
            {
                path: "vendors",
                element: <Vendors />
            },
            {
                path: "branches",
                element: <h1>Branches</h1>
            },
            {
                path: "catalog",
                element: <h1>Catalog</h1>
            },
            {
                path: "analytics",
                element: <h1>Analytics</h1>
            }
        ]
    },
] 

export default routes;