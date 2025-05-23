import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [

    // 소연
    route("/signup", "routes/users/signupPage.tsx"),

    // 근화
    route("/admin/points", "layout/points/pointLayout.tsx", [
        route("list", 'routes/admin/points/listPage.tsx'),
        route("read/:id", 'routes/admin/points/readPage.tsx'),
        route("add", 'routes/admin/points/addPage.tsx'),
        route("edit/:id", 'routes/admin/points/editPage.tsx')
    ]),

    route("points/store/list",   "routes/points/storelistPage.tsx"),

    /*route("/user/mypage/points/history", "routes/user/mypage/pointHistoryPage.tsx"), // 포인트 내역*/
    route("/user/mypage/coupons", "routes/users/userCouponPage.tsx"), // 쿠폰함


    // 동훈
    route("admin/notices/list",   "routes/admin/notices/listPage.tsx"),
    route("admin/notices/add",    "routes/admin/notices/addPage.tsx"),
    route("admin/notices/:id",    "routes/admin/notices/detailPage.tsx"),
    route("admin/notices/:id/edit","routes/admin/notices/editPage.tsx"),
    
    // 강민
    route('/','layout/authLayout.tsx', [
        route("home", "routes/home.tsx"),
        route('login', 'routes/auth/loginPage.tsx'),
    ]),
    route('login/google', 'routes/auth/googleRedirect.tsx'),
  
] satisfies RouteConfig;
