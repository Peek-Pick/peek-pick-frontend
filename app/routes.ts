import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [

    index("routes/home.tsx"),           // 협업 후 홈
    // route("login", "routes/page/loginPage.tsx"),
      
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

