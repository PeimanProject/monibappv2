import { translations } from "@/messages";
import { useLocaleStore } from "@/store/localStore";



export function useTranslate() {
    const { locale } = useLocaleStore();
    const t = translations[locale];

    // helper to access nested keys easily
    function get(path) {
        return path.split(".").reduce((obj, key) => obj?.[key], t) || path;
    }

    return { t, get };
}
