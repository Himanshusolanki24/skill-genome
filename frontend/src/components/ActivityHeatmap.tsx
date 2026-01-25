import { useMemo, useState, useCallback } from "react";

// ============================================================================
// TYPES
// ============================================================================
interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  loading?: boolean;
  year?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const ACTIVITY_COLORS = {
  0: "#1f2933",   // 0 contributions
  1: "#0e4429",   // 1–2 contributions
  2: "#006d32",   // 3–5 contributions
  3: "#26a641",   // 6–9 contributions
  4: "#39d353",   // 10+ contributions
} as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getActivityLevel = (count: number): keyof typeof ACTIVITY_COLORS => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTooltipDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = FULL_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================
interface TooltipProps {
  content: string;
  position: { x: number; y: number } | null;
}

const HeatmapTooltip = ({ content, position }: TooltipProps) => {
  if (!position) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y - 40,
        transform: "translateX(-50%)",
      }}
    >
      <div
        style={{
          backgroundColor: "#111827",
          color: "#e5e7eb",
          fontSize: "12px",
          padding: "6px 10px",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          whiteSpace: "nowrap",
        }}
      >
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ActivityHeatmap = ({ data, loading = false, year: propYear }: ActivityHeatmapProps) => {
  const [tooltip, setTooltip] = useState<{ content: string; position: { x: number; y: number } } | null>(null);
  const currentYear = propYear ?? new Date().getFullYear();

  // Activity lookup map
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => map.set(item.date, item.count));
    return map;
  }, [data]);

  // Generate calendar grid for the specified year
  const { weeks, monthLabels } = useMemo(() => {
    const weeksArray: (Date | null)[][] = [];

    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    // Align grid to start on Sunday of the week containing Jan 1
    const gridStart = new Date(yearStart);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    let cursor = new Date(gridStart);

    // Build weeks until we've covered the entire year
    while (cursor <= yearEnd || weeksArray[weeksArray.length - 1]?.length < 7) {
      const week: (Date | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(cursor);
        if (cellDate.getFullYear() === currentYear) {
          week.push(cellDate);
        } else {
          week.push(null);
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      weeksArray.push(week);
      if (cursor > yearEnd && week.length === 7) break;
      if (weeksArray.length > 54) break;
    }

    // Calculate month label positions
    const monthLabelPositions: { name: string; colIndex: number }[] = [];
    let currentMonth = -1;

    weeksArray.forEach((week, colIdx) => {
      const firstValidDate = week.find((d) => d !== null);
      if (firstValidDate) {
        const month = firstValidDate.getMonth();
        if (month !== currentMonth) {
          monthLabelPositions.push({
            name: MONTHS[month],
            colIndex: colIdx,
          });
          currentMonth = month;
        }
      }
    });

    return {
      weeks: weeksArray,
      monthLabels: monthLabelPositions,
    };
  }, [currentYear]);

  // Tooltip handlers
  const showTooltip = useCallback((e: React.MouseEvent | React.FocusEvent, count: number, date: Date) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      content: `${count} contribution${count !== 1 ? "s" : ""} on ${formatTooltipDate(date)}`,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top,
      },
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  // Check if date is in the future
  const isFuture = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-[#0f0f0f] rounded-lg">
        <div className="animate-pulse text-gray-400 text-sm">Loading activity...</div>
      </div>
    );
  }

  // Calculate dynamic cell size based on container width
  const totalWeeks = weeks.length;

  return (
    <div className="bg-[#0f0f0f] p-4 rounded-lg">
      {/* Month Labels - evenly spaced */}
      <div className="flex justify-between mb-2 px-1">
        {MONTHS.map((month) => (
          <span key={month} className="text-xs text-gray-400 w-[8%] text-center">
            {month}
          </span>
        ))}
      </div>

      {/* Heatmap Grid - responsive */}
      <div className="flex gap-[2px]">
        {weeks.map((week, colIdx) => (
          <div
            key={`week-${colIdx}`}
            className="flex flex-col gap-[2px]"
            style={{ flex: `1 1 ${100 / totalWeeks}%`, minWidth: 0 }}
          >
            {week.map((date, rowIdx) => {
              if (date === null) {
                return (
                  <div
                    key={`${colIdx}-${rowIdx}`}
                    className="w-full aspect-square"
                  />
                );
              }

              const dateKey = formatDateKey(date);
              const count = activityMap.get(dateKey) || 0;
              const level = getActivityLevel(count);
              const future = isFuture(date);

              return (
                <div
                  key={`${colIdx}-${rowIdx}`}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`${count} contributions on ${formatTooltipDate(date)}`}
                  onMouseEnter={(e) => !future && showTooltip(e, count, date)}
                  onMouseLeave={hideTooltip}
                  onFocus={(e) => !future && showTooltip(e, count, date)}
                  onBlur={hideTooltip}
                  className="w-full aspect-square rounded-sm transition-all cursor-pointer hover:brightness-125"
                  style={{
                    backgroundColor: future ? "transparent" : ACTIVITY_COLORS[level],
                    opacity: future ? 0.15 : 1,
                    cursor: future ? "default" : "pointer",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-3 gap-1">
        <span className="text-xs text-gray-400 mr-2">Less</span>
        {Object.values(ACTIVITY_COLORS).map((color, idx) => (
          <div
            key={idx}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-xs text-gray-400 ml-2">More</span>
      </div>

      {/* Tooltip */}
      <HeatmapTooltip content={tooltip?.content || ""} position={tooltip?.position || null} />
    </div>
  );
};

export default ActivityHeatmap;
