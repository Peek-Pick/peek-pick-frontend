// app/root.tsx
import {
    Links,
    Meta,
    Scripts,
    ScrollRestoration,
} from "react-router";
import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./app.css";
import "../public/assets/css/paper-dashboard.css"; //템플릿 설정

const queryClient = new QueryClient();

export function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <head>
            <meta charSet="utf-8" />
            <Meta />
            <Links />
        </head>
        <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Document>
                <Outlet />
            </Document>
        </QueryClientProvider>
    );
}
