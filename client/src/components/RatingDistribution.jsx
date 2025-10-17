import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * @param {{ distribution: { [key: number]: number } }} props
 */
function RatingDistribution({ distribution }) {
  // Runtime check: ensure distribution is a valid object
  if (typeof distribution !== "object" || distribution === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="text-red-500 text-sm">
          Invalid distribution data
        </CardContent>
      </Card>
    );
  }

  // Normalize keys to numbers to avoid "string key" issues
  const normalized = Object.fromEntries(
    Object.entries(distribution).map(([key, value]) => [Number(key), Number(value) || 0])
  );

  const total = Object.values(normalized).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Simplified & visible bar colors
  const getBarColor = (rating) => {
    switch (rating) {
      case 5:
        return "bg-blue-500";
      case 4:
        return "bg-blue-400";
      case 3:
        return "bg-green-500";
      case 2:
        return "bg-green-400";
      case 1:
        return "bg-red-400";
      default:
        return "bg-gray-300";
    }
  };

  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
        {ratings.map((rating) => {
          const count = normalized[rating] || 0;
          const percentage = getPercentage(count);

          return (
            <div key={rating} className="flex items-center gap-2 sm:gap-3">
              {/* Rating label + stars */}
              <div className="flex items-center gap-0.5 sm:gap-1 w-20 sm:w-32">
                <span className="text-xs sm:text-sm font-medium">{rating}</span>
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(rating)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage label */}
              <span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-10 text-right">
                {percentage}%
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { RatingDistribution };
export default RatingDistribution;