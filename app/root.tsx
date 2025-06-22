import {Links, Meta, Scripts, ScrollRestoration,} from "react-router";
import {Outlet} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./app.css";
import {AdminAuthProvider} from "~/contexts/AdminAuthContext";

const queryClient = new QueryClient();

export function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <head>
            <meta charSet="utf-8"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="theme-color" content="#3182f6"/>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta/>
            <Links/>
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
            <AdminAuthProvider>
                <Document>
                    <Outlet />
                </Document>
            </AdminAuthProvider>
        </QueryClientProvider>
    );
}
