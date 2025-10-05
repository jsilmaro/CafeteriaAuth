import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * @param {{ distribution: { 5: number, 4: number, 3: number, 2: number, 1: number } }} props
 */
function RatingDistribution({ distribution }) {
  // Runtime check: ensure distribution is an object
  if (typeof distribution !== "object" || distribution === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="text-red-500">Invalid distribution data</CardContent>
      </Card>
    );
  }

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const getBarColor = (rating) => {
    if (rating === 5) return "bg-chart-1";
    if (rating === 4) return "bg-chart-1/70";
    if (rating === 3) return "bg-chart-2";
    if (rating === 2) return "bg-chart-2/70";
    return "bg-chart-3";
  };

  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ratings.map((rating) => {
          const percentage = getPercentage(distribution[rating]);
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-32">
                <span className="text-sm font-medium">{rating}</span>
                {/* Show exactly 'rating' number of stars */}
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(rating)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-10 text-right">{percentage}%</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { RatingDistribution };
export default RatingDistribution;