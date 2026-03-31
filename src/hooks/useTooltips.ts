import { useState, useEffect } from "react";
import api from "../services/axios";

export interface TooltipData {
    tooltipId: string;
    title?: string;
    content: string;
}

const useTooltips = () => {
    const [tooltips, setTooltips] = useState<Record<string, TooltipData>>({});
    const [loading, setLoading] = useState(true);

    const fetchTooltips = async () => {
        try {
            const res = await api.get("/dashboard/tooltips");
            const mapping: Record<string, TooltipData> = {};
            res.data.data.forEach((t: TooltipData) => {
                mapping[t.tooltipId] = t;
            });
            setTooltips(mapping);
        } catch (error) {
            console.error("Failed to fetch tooltips:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTooltips();
    }, []);

    const updateTooltip = async (tooltipId: string, content: string, title?: string) => {
        try {
            await api.put("/dashboard/tooltips", { tooltipId, content, title });
            await fetchTooltips();
        } catch (error) {
            console.error("Failed to update tooltip:", error);
            throw error;
        }
    };

    return { tooltips, loading, updateTooltip, refresh: fetchTooltips };
};

export default useTooltips;
