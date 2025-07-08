import { useRef, useLayoutEffect, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate, useNavigationType } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { getMyPageFavorite } from "~/api/users/myPageAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import {useTranslation} from "react-i18next";

const STORAGE_KEY = "favoritesPageScrollY";

export default function FavoritesPage() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language; // "en" | "ko" | "ja"
    const size = 12;
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const isRestoredRef = useRef(false);
    const initialLoadRef = useRef(true);

    useLayoutEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        if (initialLoadRef.current) {
            const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
            const navType = navEntries.at(-1)?.type ?? "";
            if (navType === "reload") {
                window.scrollTo(0, 0);
                sessionStorage.removeItem(STORAGE_KEY);
                isRestoredRef.current = false;
            }
            initialLoadRef.current = false;
        }
        return () => {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "auto";
            }
        };
    }, []);

    useEffect(() => {
        if (navigationType !== "POP") {
            sessionStorage.removeItem(STORAGE_KEY);
            isRestoredRef.current = false;
        }
    }, [navigationType]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery<PageResponseCursor<ProductListDTO>, Error>({
        queryKey: ["favoritesCursor", size],
        queryFn: async ({ pageParam }) => {
            const last = pageParam as { lastModDate?: string; lastProductId?: number } | undefined;
            return await getMyPageFavorite(
                size,
                last?.lastModDate,
                last?.lastProductId,
                lang
            );
        },
        getNextPageParam: (lastPage) => {
            const last = lastPage.content.at(-1);
            if (!last || !last.modDate || !last.productId || !lastPage.hasNext) return undefined;
            return {
                lastModDate: last.modDate,
                lastProductId: last.productId,
            };
        },
        initialPageParam: undefined,
        // staleTime: 5 * 60 * 1000,
    });

    const handleItemClick = (barcode: string) => {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ scrollY: window.scrollY, fromDetail: true })
        );
        navigate(`/products/${barcode}`, { state: { fromDetail: true } });
    };

    useEffect(() => {
        if (navigationType === "POP" && data && !isRestoredRef.current) {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                const { scrollY, fromDetail } = JSON.parse(raw);
                if (fromDetail) {
                    window.scrollTo(0, scrollY);
                    requestAnimationFrame(() => window.scrollTo(0, scrollY));
                }
                sessionStorage.removeItem(STORAGE_KEY);
            }
            isRestoredRef.current = true;
        }
    }, [navigationType, data]);

    return (
        <>
            <ListComponent
                products={data ? data.pages.flatMap(pg => pg.content) : []}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
                onItemClick={handleItemClick}
            />
            {/*<BottomNavComponent />*/}
            <BackButton />
            <FloatingActionButtons />
        </>
    );
}
