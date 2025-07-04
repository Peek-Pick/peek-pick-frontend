import { Links, Meta, Scripts, ScrollRestoration } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminAuthProvider } from "~/contexts/AdminAuthContext";
import "./app.css";
import "./i18n";
import "./settingFCM";

const queryClient = new QueryClient();

export function Document({ children }: { children: React.ReactNode }) {
    return (
        <html>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#3182f6" />
            <link rel="manifest" href="/manifest.json" />
            <Meta />
            <Links />
            <title>Peek & Pick</title>
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