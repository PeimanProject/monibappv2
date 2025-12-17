"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore"
export function StoreHydration({ children }) {
    useEffect(() => {
        const load = async () => {

            await useUserStore.persist.rehydrate();
        }
        load()
    }, [])
    return <>{children}</>;
}
