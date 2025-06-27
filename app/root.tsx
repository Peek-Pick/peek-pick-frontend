import { Links, Meta, Scripts, ScrollRestoration } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminAuthProvider } from "~/contexts/AdminAuthContext";
import "./app.css";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
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
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(reg => {
                    console.log('[SW] Registered:', reg.scope);

                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('[SW] New content is available; please refresh.');
                                }
                            });
                        }
                    });
                })
                .catch(err => {
                    console.error('[SW] Registration failed:', err);
                });
        }
    }, []);

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