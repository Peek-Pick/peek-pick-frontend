import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),

    // 바코드
    route("barcode/scan", "routes/barcode/scanPage.tsx"),

    // app
    route("", "layout/appLayout.tsx", [
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
        route("/mypage/edit", "routes/users/myPageEditPage.tsx"),

        // 포인트
        route("points/store/list",   "routes/points/storelistPage.tsx"), //포인트 상점
        route("/mypage/points/history", "routes/users/pointLogsPage.tsx"), // 포인트 내역
        route("/mypage/coupons", "routes/users/userCouponPage.tsx"), // 쿠폰함
        route("/mypage/favorites", "routes/users/favoritesPage.tsx"), // 즐겨찾기 상품 목록
        route("/mypage/views",   "routes/users/viewsPage.tsx"), // 상품 조회 내역
        // 상품
        route("products/ranking",    "routes/products/rankingPage.tsx"),
        route("products/:barcode",   "routes/products/detailPage.tsx"),
        route("products/recommended",   "routes/products/recommendedPage.tsx"), // 상품 추천
        route("products/search",   "routes/products/searchPage.tsx"), // 상품 추천

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
        route("inquiries/list",       "routes/inquiries/listPage.tsx"),
        route("inquiries/add",        "routes/inquiries/addPage.tsx"),
        route("inquiries/:id",        "routes/inquiries/detailPage.tsx"),   // <-- useParams().id
        route("inquiries/:id/edit",   "routes/inquiries/editPage.tsx"),

        // 지도
        route("map", "routes/map/mapPage.tsx"),

        // 검색
        // route("search", "routes/search/searchPage.tsx"),

        // 내역
        route("barcode/history", "routes/barcode/barcodeHistoryPage.tsx"),

    ]),

    // admin
    route("/admin", "layout/adminLayout.tsx", [
        // 로그인
        route('login', 'routes/admin/auth/loginPage.tsx'),
        
        //관리자 대시보드
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
        // route("inquiries/list",       "routes/admin/inquiries/listPage.tsx"),    // 사용자 문의목록
        // route("inquiries/add",        "routes/admin/inquiries/addPage.tsx"),     // 답변 등록
        // route("inquiries/:id",        "routes/admin/inquiries/detailPage.tsx"),  // 문의 상세보기
        // route("inquiries/:id/edit",   "routes/admin/inquiries/editPage.tsx"),

        //신고
        route("reports/list",       "routes/admin/reports/listPage.tsx"),

        // 어드민 상품
         route("products/list",       "routes/admin/products/listPage.tsx"),     // 상품 목록
         route("products/add",        "routes/admin/products/addPage.tsx"),      // 상품 등록
         route("products/:id",        "routes/admin/products/detailPage.tsx"),   // 상품 상세
         route("products/:id/edit",   "routes/admin/products/editPage.tsx"),     // 수정

        // 어드민 유저
        route("users/list",       "routes/admin/users/adminUsersListPage.tsx"), // 목록
        route("users/:uid",        "routes/admin/users/auDetailPage.tsx"), // 상세

        // 어드민 리뷰
        route("reviews/list",       "routes/admin/reviews/listPage.tsx"),
        route("reviews/:rid",        "routes/admin/reviews/readPage.tsx"),

    ])
  
] satisfies RouteConfig;
