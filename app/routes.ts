import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/admin/points", "layout/points/pointLayout.tsx", [
        route("list", 'routes/admin/points/listPage.tsx'),
        route("read/:id", 'routes/admin/points/readPage.tsx'),
        route("add", 'routes/admin/points/addPage.tsx'),
        route("edit/:id", 'routes/admin/points/editPage.tsx')
    ])

] satisfies RouteConfig;
