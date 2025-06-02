import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),

    // 바코드
    route("barcode/scan", "routes/barcode/scanPage.tsx"),

    // app
    route("", "layout/applayout.tsx", [
        //메인
        route("main", "routes/appMainPage.tsx"),

        // 로그인
        route('/login', 'routes/auth/loginPage.tsx'),

        // 회원가입
        route("/signup", "layout/signupLayout.tsx", [
            index("routes/users/signupPage.tsx"),
            route("profile", "routes/users/signupProfilePage.tsx"),
            route("tag", "routes/users/signupTagPage.tsx"),
            route("google", "routes/auth/googleCallbackPage.tsx"),
        ]),

        // 마이페이지
        route("/mypage", "routes/users/myPagePage.tsx"),
        // route("/mypage/edit", "routes/users/myPageEditPage.tsx"),

        // 포인트
        route("points/store/list",   "routes/points/storelistPage.tsx"), //포인트 상점
        route("/mypage/points/history", "routes/users/pointLogsPage.tsx"), // 포인트 내역
        route("/mypage/coupons", "routes/users/userCouponPage.tsx"), // 쿠폰함

        // 상품
        route("products/ranking",    "routes/products/listPage.tsx"),
        route("products/:barcode",   "routes/products/detailPage.tsx"),

        // 리뷰
        route("/reviews/product/:barcode", "routes/reviews/productListPage.tsx"),
        route("/reviews/user", "routes/reviews/userListPage.tsx"),
        route("/reviews/add/:barcode", "routes/reviews/addPage.tsx"),
        route("/reviews/modify/:rid", "routes/reviews/modifyPage.tsx"),
        route("/reviews/:rid", "routes/reviews/detailPage.tsx"),

        // 공지
        // route("notices/list",       "routes/notices/listPage.tsx"),
        // route("notices/add",        "routes/notices/addPage.tsx"),
        // route("notices/:id",        "routes/notices/detailPage.tsx"),   // <-- useParams().id
        // route("notices/:id/edit",   "routes/notices/editPage.tsx"),

        // 문의사항
        // route("inquiries/list",       "routes/inquiries/listPage.tsx"),
        // route("inquiries/add",        "routes/inquiries/addPage.tsx"),
        // route("inquiries/:id",        "routes/inquiries/detailPage.tsx"),   // <-- useParams().id
        // route("inquiries/:id/edit",   "routes/inquiries/editPage.tsx"),

        // 지도
        route("map", "routes/map/kakaoMapPage.tsx"),

        // 검색
        // route("search", "routes/search/searchPage.tsx"),


    ]),

    // admin
    route("/admin", "layout/adminLayout.tsx", [
        // 관리자 대시보드
        route("dashboard", "routes/admin/dashboardPage.tsx"),

        // 포인트
        route("points/list", 'routes/admin/points/listPage.tsx'),
        route("points/read/:id", 'routes/admin/points/readPage.tsx'),
        route("points/add", 'routes/admin/points/addPage.tsx'),
        route("points/edit/:id", 'routes/admin/points/editPage.tsx'),

        // 공지
        route("notices/list",       "routes/admin/notices/listPage.tsx"),
        route("notices/add",        "routes/admin/notices/addPage.tsx"),
        route("notices/:id",        "routes/admin/notices/detailPage.tsx"),   // <-- useParams().id
        route("notices/:id/edit",   "routes/admin/notices/editPage.tsx"),

        // 문의사항
        // route("inquiries/list",       "routes/admin/inquiries/listPage.tsx"),
        // route("inquiries/add",        "routes/admin/inquiries/addPage.tsx"),
        // route("inquiries/:id",        "routes/admin/inquiries/detailPage.tsx"),   // <-- useParams().id
        // route("inquiries/:id/edit",   "routes/admin/inquiries/editPage.tsx"),
    ])
  
] satisfies RouteConfig;
