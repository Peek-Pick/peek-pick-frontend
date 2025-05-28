import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [

    index("routes/index.tsx"),

    // 포빙빙
    route("/reviews/product/:productId", "routes/reviews/productListPage.tsx"),
    route("/reviews/user", "routes/reviews/userListPage.tsx"),
    route("/reviews/add/:pid", "routes/reviews/addPage.tsx"),
    route("/reviews/modify/:rid", "routes/reviews/modifyPage.tsx"),
    route("/reviews/:rid", "routes/reviews/detailPage.tsx"),

    // 소연
    route("/signup", "layout/signupLayout.tsx", [
        index("routes/users/signupPage.tsx"),
        route("profile", "routes/users/signupProfilePage.tsx"),
        route("tag", "routes/users/signupTagPage.tsx"),
        route("google", "routes/auth/googleCallbackPage.tsx"),
    ]),

    // 근화
    route("/admin/points", "layout/points/pointLayout.tsx", [
        route("list", 'routes/admin/points/listPage.tsx'),
        route("read/:id", 'routes/admin/points/readPage.tsx'),
        route("add", 'routes/admin/points/addPage.tsx'),
        route("edit/:id", 'routes/admin/points/editPage.tsx')
    ]),
    route("points/store/list",   "routes/points/storelistPage.tsx"), //포인트 상점
    route("/user/mypage/points/history", "routes/users/pointLogsPage.tsx"), // 포인트 내역
    route("/user/mypage/coupons", "routes/users/userCouponPage.tsx"), // 쿠폰함
      
    // 동훈
    route("/admin/notices", "layout/noticeLayout.tsx", [
        route("list",   "routes/admin/notices/listPage.tsx"),
        route("add",    "routes/admin/notices/addPage.tsx"),
        route(":id",    "routes/admin/notices/detailPage.tsx"),   // <-- useParams().id
        route(":id/edit","routes/admin/notices/editPage.tsx"),
    ]),
    route("products/ranking", "routes/products/listPage.tsx"),
    route("products/:barcode", "routes/products/detailPage.tsx"),


    // 강민
    route('','layout/authLayout.tsx', [
        route("/home", "routes/home.tsx"),
        route('/login', 'routes/auth/loginPage.tsx'),
    ]),

  
] satisfies RouteConfig;
