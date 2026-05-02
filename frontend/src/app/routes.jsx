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
                path: "settings",
                element: <h1>Settings</h1>
            }
        ]
    },
] 

export default routes;