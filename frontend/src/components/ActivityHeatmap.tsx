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
// CONSTANTS - Exact LeetCode/GFG Color Scheme
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

// Cell dimensions - exact LeetCode/GFG specs
const CELL_SIZE = 10;
const CELL_GAP = 3;
const CELL_RADIUS = 2;

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

const formatAriaLabel = (count: number, date: Date): string => {
  return `${count} contribution${count !== 1 ? "s" : ""} on ${formatTooltipDate(date)}`;
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
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
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
        // Only include dates within the target year, mark others as null (inactive)
        if (cellDate.getFullYear() === currentYear) {
          week.push(cellDate);
        } else {
          week.push(null);
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      weeksArray.push(week);
      if (cursor > yearEnd && week.length === 7) break;
      if (weeksArray.length > 54) break; // Safety limit
    }

    // Calculate month label positions
    const monthLabelPositions: { name: string; colIndex: number }[] = [];
    let currentMonth = -1;

    weeksArray.forEach((week, colIdx) => {
      // Find first valid date in this week
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

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (loading) {
    return (
      <div
        className="w-full h-40 flex items-center justify-center"
        style={{ backgroundColor: "#0f0f0f" }}
      >
        <div className="animate-pulse text-gray-400 text-sm">Loading activity...</div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  const gridWidth = weeks.length * CELL_SIZE + (weeks.length - 1) * CELL_GAP;

  return (
    <div
      style={{
        backgroundColor: "#0f0f0f",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      {/* Scrollable container for mobile */}
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
        }}
        className="scrollbar-genome"
      >
        <div style={{ minWidth: gridWidth }}>
          {/* MONTH LABELS */}
          <div
            style={{
              display: "flex",
              marginBottom: "4px",
              gap: `${CELL_GAP}px`,
            }}
          >
            {weeks.map((_, colIdx) => {
              const label = monthLabels.find((m) => m.colIndex === colIdx);
              return (
                <div
                  key={`month-${colIdx}`}
                  style={{
                    width: `${CELL_SIZE}px`,
                    flexShrink: 0,
                    fontSize: "12px",
                    color: "#9ca3af",
                    textAlign: "left",
                  }}
                >
                  {label?.name || ""}
                </div>
              );
            })}
          </div>

          {/* HEATMAP GRID */}
          <div
            style={{
              display: "flex",
              gap: `${CELL_GAP}px`,
            }}
          >
            {weeks.map((week, colIdx) => (
              <div
                key={`week-${colIdx}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${CELL_GAP}px`,
                }}
              >
                {week.map((date, rowIdx) => {
                  // Null dates (outside target year) - render empty placeholder
                  if (date === null) {
                    return (
                      <div
                        key={`${colIdx}-${rowIdx}`}
                        style={{
                          width: `${CELL_SIZE}px`,
                          height: `${CELL_SIZE}px`,
                        }}
                      />
                    );
                  }

                  const dateKey = formatDateKey(date);
                  const count = activityMap.get(dateKey) || 0;
                  const level = getActivityLevel(count);
                  const future = isFuture(date);
                  const ariaLabel = formatAriaLabel(count, date);

                  return (
                    <div
                      key={`${colIdx}-${rowIdx}`}
                      role="gridcell"
                      tabIndex={0}
                      aria-label={ariaLabel}
                      onMouseEnter={(e) => !future && showTooltip(e, count, date)}
                      onMouseLeave={hideTooltip}
                      onFocus={(e) => !future && showTooltip(e, count, date)}
                      onBlur={hideTooltip}
                      style={{
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                        borderRadius: `${CELL_RADIUS}px`,
                        backgroundColor: future ? "transparent" : ACTIVITY_COLORS[level],
                        opacity: future ? 0.15 : 1,
                        cursor: future ? "default" : "pointer",
                        transition: "filter 150ms ease-in-out",
                        outline: "none",
                      }}
                      onMouseOver={(e) => {
                        if (!future) {
                          (e.target as HTMLElement).style.filter = "brightness(1.3)";
                        }
                      }}
                      onMouseOut={(e) => {
                        (e.target as HTMLElement).style.filter = "brightness(1)";
                      }}
                      onKeyDown={(e) => {
                        if (!future && (e.key === "Enter" || e.key === " ")) {
                          // Could trigger some action if needed
                        }
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <HeatmapTooltip content={tooltip?.content || ""} position={tooltip?.position || null} />
    </div>
  );
};

export default ActivityHeatmap;
