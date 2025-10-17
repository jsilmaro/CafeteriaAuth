import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

// FoodCardProps interface removed because this is a JavaScript file.

export default function FoodCard({
  name,
  description,
  price,
  availability,
  stockLimit,
  photoURL,
  onEdit,
}) {
  const getStockStatus = () => {
    if (stockLimit === 0) return { label: "Sold Out", color: "bg-red-100 text-red-700" };
    if (stockLimit <= 5) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Available", color: "bg-green-100 text-green-700" };
  };

  const status = getStockStatus();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={photoURL} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={status.color}>
            {status.label}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#6A972E]">{`₱${parseFloat(price.replace(/[^0-9.]/g, '')).toFixed(2)}`}</span>
          <span className="text-sm text-gray-500">Stock: {stockLimit}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Item
        </Button>
      </CardFooter>
    </Card>
  );
}