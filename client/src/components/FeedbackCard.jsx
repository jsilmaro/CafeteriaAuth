import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * @typedef {Object} FeedbackCardProps
 * @property {string} customerName
 * @property {string} date
 * @property {1|2|3|4|5} rating
 * @property {string} comment
 * @property {string[]} [items]
 */

/**
 * @param {FeedbackCardProps} props
 */
function FeedbackCard({ customerName, date, rating, comment, items }) {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-base">{customerName}</h3>
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
            <div className="flex items-center gap-1">{renderStars()}</div>
          </div>
        </div>
        
        <p className="text-sm text-foreground leading-relaxed">{comment}</p>
        
        {items && items.length > 0 && (
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2">Items ordered:</div>
            <div className="flex gap-2 flex-wrap">
              {items.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FeedbackCard;
export { FeedbackCard };