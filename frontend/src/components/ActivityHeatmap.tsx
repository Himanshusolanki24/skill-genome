import { useMemo, useState, useCallback } from "react";

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  loading?: boolean;
  year?: number;
}

const ACTIVITY_COLORS = {
  0: "#0e4429",   // Base green color for all past dates
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
} as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

const ActivityHeatmap = ({ data, loading = false, year: propYear }: ActivityHeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; count: number } | null>(null);
  const currentYear = propYear ?? new Date().getFullYear();

  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => map.set(item.date, item.count));
    return map;
  }, [data]);

  // Generate all weeks for the year (52-53 weeks)
  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    // Start from first Sunday on or before Jan 1
    const gridStart = new Date(yearStart);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    let current = new Date(gridStart);

    while (current <= yearEnd) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeksArray.push(week);
    }

    return weeksArray;
  }, [currentYear]);

  const isFuture = (date: Date): boolean => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  const isCurrentYear = (date: Date): boolean => {
    return date.getFullYear() === currentYear;
  };

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-[#0d1117] rounded-lg">
        <div className="animate-pulse text-gray-400 text-sm">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] p-4 rounded-lg overflow-hidden">
      {/* Month Labels */}
      <div
        className="grid mb-2"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          gap: '0px'
        }}
      >
        {weeks.map((week, idx) => {
          const firstDay = week.find(d => isCurrentYear(d));
          const showLabel = firstDay && firstDay.getDate() <= 7;
          return (
            <div
              key={idx}
              className="text-[10px] text-gray-500 overflow-hidden whitespace-nowrap"
              style={{ minWidth: 0 }}
            >
              {showLabel ? MONTHS[firstDay.getMonth()] : ''}
            </div>
          );
        })}
      </div>

      {/* Heatmap Grid - 7 rows (days) x 52-53 columns (weeks) */}
      <div className="flex flex-col gap-[2px]">
        {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
          <div
            key={dayOfWeek}
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, 1fr)`
            }}
          >
            {weeks.map((week, weekIdx) => {
              const date = week[dayOfWeek];
              const dateKey = formatDateKey(date);
              const count = activityMap.get(dateKey) || 0;
              const level = getActivityLevel(count);
              const future = isFuture(date);
              const inYear = isCurrentYear(date);

              if (!inYear) {
                return (
                  <div
                    key={`${weekIdx}-${dayOfWeek}`}
                    className="aspect-square rounded-sm"
                    style={{ backgroundColor: 'transparent' }}
                  />
                );
              }

              return (
                <div
                  key={`${weekIdx}-${dayOfWeek}`}
                  className="aspect-square rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-gray-500"
                  style={{
                    backgroundColor: future ? '#161b22' : ACTIVITY_COLORS[level],
                    opacity: future ? 0.3 : 1,
                    minWidth: '6px',
                    maxWidth: '12px',
                  }}
                  onMouseEnter={() => !future && setHoveredCell({ date, count })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={future ? 'Future' : `${count} contributions on ${date.toDateString()}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-3 gap-1">
        <span className="text-[10px] text-gray-500 mr-1">Less</span>
        {Object.values(ACTIVITY_COLORS).map((color, idx) => (
          <div
            key={idx}
            className="w-[10px] h-[10px] rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-[10px] text-gray-500 ml-1">More</span>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="mt-2 text-center text-xs text-gray-400">
          {hoveredCell.count} contribution{hoveredCell.count !== 1 ? 's' : ''} on {FULL_MONTHS[hoveredCell.date.getMonth()]} {hoveredCell.date.getDate()}, {hoveredCell.date.getFullYear()}
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
