import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";

export interface TooltipData {
    tooltipId: string;
    title?: string;
    content: string;
}

interface TooltipContextType {
    tooltips: Record<string, TooltipData>;
    loading: boolean;
    updateTooltip: (tooltipId: string, content: string, title?: string) => Promise<void>;
    refresh: () => Promise<void>;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tooltips, setTooltips] = useState<Record<string, TooltipData>>({});
    const [loading, setLoading] = useState(true);

    const fetchTooltips = async () => {
        try {
            const res = await api.get("/dashboard/tooltips");
            const mapping: Record<string, TooltipData> = {};
            if (res.data?.data) {
                res.data.data.forEach((t: TooltipData) => {
                    mapping[t.tooltipId] = t;
                });
            }
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
            const res = await api.get("/dashboard/tooltips");
            const mapping: Record<string, TooltipData> = {};
            if (res.data?.data) {
                res.data.data.forEach((t: TooltipData) => {
                    mapping[t.tooltipId] = t;
                });
            }
            setTooltips(mapping);
        } catch (error) {
            console.error("Failed to update tooltip:", error);
            throw error;
        }
    };

    return (
        <TooltipContext.Provider value={{ tooltips, loading, updateTooltip, refresh: fetchTooltips }}>
            {children}
        </TooltipContext.Provider>
    );
};

export const useTooltipContext = () => {
    const context = useContext(TooltipContext);
    if (context === undefined) {
        throw new Error("useTooltipContext must be used within a TooltipProvider");
    }
    return context;
};
