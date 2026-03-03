import React, { useEffect, useRef } from "react";
import { Chart, ArcElement, PieController, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, PieController, Tooltip, Legend);

interface PieChartProps {
    data: number[];
    labels: string[];
    colors?: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, labels, colors }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart<"pie", number[], string> | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--app-text-muted') || '#5d5d5d';
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--app-surface') || '#ffffff';

        if (canvasRef.current && data.length > 0) {
            chartRef.current = new Chart(canvasRef.current, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: colors || ["#448CD2", "#10b981", "#8E54E9", "#f59e0b"],
                            borderColor: borderColor,
                            borderWidth: 2,
                            hoverOffset: 12
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 10
                    },
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                color: textColor,
                                boxWidth: 8,
                                boxHeight: 8,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: { size: 10, weight: 'bold' },
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: isDarkMode ? '#1e293b' : '#0f172a',
                            titleFont: { size: 12, weight: 'bold' },
                            bodyFont: { size: 11 },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: (context) => {
                                    const total = context.dataset.data.reduce((a, b) => a + (b as number), 0);
                                    const value = context.parsed as number;
                                    const percentage = ((value / total) * 100).toFixed(1) + "%";
                                    return ` ${context.label}: ${value} users (${percentage})`;
                                }
                            }
                        }
                    },
                },
            });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, labels, colors]);

    return <div className="h-[250px] w-full flex items-center justify-center"><canvas ref={canvasRef} /></div>;
};

export default PieChart;
