import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    route('', 'routes/home.tsx'),
    route('/auth','layout/authLayout.tsx', [
        route('login', 'routes/auth/loginPage.tsx'),
    ]),
    route('/auth/login/google', 'routes/auth/googleRedirect.tsx'),
] satisfies RouteConfig;