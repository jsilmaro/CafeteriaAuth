import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import PropTypes from "prop-types";

function FilterPills({ activeFilter, onFilterChange, counts }) {
  const filters = [
    { value: "all", label: "All", stars: null },
    { value: 5, label: "5", stars: 5 },
    { value: 4, label: "4", stars: 4 },
    { value: 3, label: "3", stars: 3 },
    { value: 2, label: "2", stars: 2 },
    { value: 1, label: "1", stars: 1 },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Filter by rating:</span>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = counts?.[filter.value] || 0;
        
        return (
          <Badge
            key={filter.value}
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer hover-elevate active-elevate-2 gap-1"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.stars !== null && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            )}
            <span>{filter.label}</span>
            {counts && <span className="ml-1 text-xs opacity-70">({count})</span>}
          </Badge>
        );
      })}
    </div>
  );
}

export { FilterPills };
export default FilterPills;