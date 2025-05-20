import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  
    // 근화
    route("/admin/points", "layout/points/pointLayout.tsx", [
        route("list", 'routes/admin/points/listPage.tsx'),
        route("read/:id", 'routes/admin/points/readPage.tsx'),
        route("add", 'routes/admin/points/addPage.tsx'),
        route("edit/:id", 'routes/admin/points/editPage.tsx')
    ]),
      
    // 동훈
    route("admin/notices/list",   "routes/admin/notices/listPage.tsx"),
    route("admin/notices/add",    "routes/admin/notices/addPage.tsx"),
    route("admin/notices/:id",    "routes/admin/notices/detailPage.tsx"),
    route("admin/notices/:id/edit","routes/admin/notices/editPage.tsx"),
    
    // 강민
    route('/auth','layout/authLayout.tsx', [
        route('login', 'routes/auth/loginPage.tsx'),
    ]),
    route('/auth/login/google', 'routes/auth/googleRedirect.tsx'),
  
] satisfies RouteConfig;
