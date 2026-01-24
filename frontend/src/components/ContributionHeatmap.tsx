import React, { useState, useMemo, useCallback } from "react";

interface DayData {
    date: Date;
    count: number;
}

interface ContributionHeatmapProps {
    data?: Record<string, number>; // { "YYYY-MM-DD": count }
    year?: number;
    onYearChange?: (year: number) => void;
}

// Exact colors from LeetCode/GFG
const COLORS = {
    empty: "#1f2933",      // 0 contributions
    level1: "#0e4429",     // 1-2 contributions
    level2: "#006d32",     // 3-5 contributions
    level3: "#26a641",     // 6-9 contributions
    level4: "#39d353",     // 10+ contributions
};

const getColor = (count: number): string => {
    if (count === 0) return COLORS.empty;
    if (count <= 2) return COLORS.level1;
    if (count <= 5) return COLORS.level2;
    if (count <= 9) return COLORS.level3;
    return COLORS.level4;
};

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
    data = {},
    year = new Date().getFullYear(),
    onYearChange,
}) => {
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        content: string;
    }>({ visible: false, x: 0, y: 0, content: "" });

    // Generate all days for the year organized by weeks
    const { weeks, monthLabels } = useMemo(() => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        // Adjust start to previous Sunday
        const firstSunday = new Date(startDate);
        firstSunday.setDate(startDate.getDate() - startDate.getDay());

        const allWeeks: DayData[][] = [];
        const labels: { weekIndex: number; month: string }[] = [];

        let currentDate = new Date(firstSunday);
        let weekIndex = 0;
        let lastMonth = -1;

        while (currentDate <= endDate || allWeeks.length < 53) {
            const week: DayData[] = [];

            for (let day = 0; day < 7; day++) {
                const dateKey = formatDateKey(currentDate);
                const isInYear = currentDate.getFullYear() === year;

                // Track month labels (only for first occurrence in year)
                if (isInYear && day === 0 && currentDate.getMonth() !== lastMonth) {
                    lastMonth = currentDate.getMonth();
                    labels.push({ weekIndex, month: MONTHS[lastMonth] });
                }

                week.push({
                    date: new Date(currentDate),
                    count: isInYear ? (data[dateKey] || 0) : -1, // -1 for out of year
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            allWeeks.push(week);
            weekIndex++;

            // Stop after we've covered the year
            if (currentDate > endDate && allWeeks.length >= 52) break;
        }

        return { weeks: allWeeks, monthLabels: labels };
    }, [year, data]);

    const handleMouseEnter = useCallback((
        e: React.MouseEvent<HTMLDivElement>,
        dayData: DayData
    ) => {
        if (dayData.count < 0) return; // Out of year
        const rect = e.currentTarget.getBoundingClientRect();
        const content = `${dayData.count} contribution${dayData.count !== 1 ? "s" : ""} on ${formatDate(dayData.date)}`;
        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
            content,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
    }, []);

    const handleFocus = useCallback((
        e: React.FocusEvent<HTMLDivElement>,
        dayData: DayData
    ) => {
        if (dayData.count < 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const content = `${dayData.count} contribution${dayData.count !== 1 ? "s" : ""} on ${formatDate(dayData.date)}`;
        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
            content,
        });
    }, []);

    const handleBlur = useCallback(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
    }, []);

    return (
        <div className="contribution-heatmap" style={{ position: "relative" }}>
            {/* Year Selector */}
            {onYearChange && (
                <div style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                        onClick={() => onYearChange(year - 1)}
                        style={{
                            background: "transparent",
                            border: "1px solid #374151",
                            borderRadius: "4px",
                            color: "#9ca3af",
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        ←
                    </button>
                    <span style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: 500 }}>
                        {year}
                    </span>
                    <button
                        onClick={() => onYearChange(year + 1)}
                        disabled={year >= new Date().getFullYear()}
                        style={{
                            background: "transparent",
                            border: "1px solid #374151",
                            borderRadius: "4px",
                            color: year >= new Date().getFullYear() ? "#4b5563" : "#9ca3af",
                            padding: "4px 8px",
                            cursor: year >= new Date().getFullYear() ? "not-allowed" : "pointer",
                            fontSize: "12px",
                        }}
                    >
                        →
                    </button>
                </div>
            )}

            {/* Scrollable Container */}
            <div
                style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    paddingBottom: "8px",
                }}
            >
                {/* Month Labels */}
                <div
                    style={{
                        display: "flex",
                        marginBottom: "4px",
                        marginLeft: "0px",
                        position: "relative",
                        height: "16px",
                    }}
                >
                    {monthLabels.map((label, idx) => (
                        <span
                            key={idx}
                            style={{
                                position: "absolute",
                                left: `${label.weekIndex * 13}px`, // 10px cell + 3px gap
                                fontSize: "12px",
                                color: "#9ca3af",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {label.month}
                        </span>
                    ))}
                </div>

                {/* Heatmap Grid */}
                <div
                    style={{
                        display: "flex",
                        gap: "3px",
                    }}
                >
                    {weeks.map((week, weekIdx) => (
                        <div
                            key={weekIdx}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "3px",
                            }}
                        >
                            {week.map((dayData, dayIdx) => {
                                const isOutOfYear = dayData.count < 0;
                                const ariaLabel = isOutOfYear
                                    ? undefined
                                    : `${dayData.count} contribution${dayData.count !== 1 ? "s" : ""} on ${formatDate(dayData.date)}`;

                                return (
                                    <div
                                        key={dayIdx}
                                        role={isOutOfYear ? undefined : "gridcell"}
                                        tabIndex={isOutOfYear ? -1 : 0}
                                        aria-label={ariaLabel}
                                        onMouseEnter={(e) => handleMouseEnter(e, dayData)}
                                        onMouseLeave={handleMouseLeave}
                                        onFocus={(e) => handleFocus(e, dayData)}
                                        onBlur={handleBlur}
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "2px",
                                            backgroundColor: isOutOfYear ? "transparent" : getColor(dayData.count),
                                            cursor: isOutOfYear ? "default" : "pointer",
                                            transition: "filter 150ms ease-in-out",
                                            outline: "none",
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isOutOfYear) {
                                                e.currentTarget.style.filter = "brightness(1.3)";
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.filter = "brightness(1)";
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip.visible && (
                <div
                    style={{
                        position: "fixed",
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: "translate(-50%, -100%)",
                        backgroundColor: "#111827",
                        color: "#e5e7eb",
                        fontSize: "12px",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default ContributionHeatmap;
