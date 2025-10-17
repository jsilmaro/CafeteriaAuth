import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RatingDistribution } from "../components/RatingDistribution";
import { FilterPills } from "../components/FilterPills";
import { FeedbackCard } from "../components/FeedbackCard";
import { Button } from "../components/ui/button";
/**
 * @typedef {Object} Feedback
 * @property {string} id
 * @property {string} customerName
 * @property {string} date
 * @property {1|2|3|4|5} rating
 * @property {string} comment
 * @property {string[]=} items
 */

//todo: remove mock functionality
const mockFeedback = [
  {
    id: "1",
    customerName: "Jennie Kim",
    date: "January 25, 2025",
    rating: 5,
    comment: "Amazing chicken rice! The flavors were perfect and the service was quick.",
    items: ["Chicken Rice", "Iced Tea"],
  },
  {
    id: "2",
    customerName: "Lisa Manoban",
    date: "January 24, 2025",
    rating: 5,
    comment: "Best cafeteria food I've ever had! Fresh ingredients and generous portions.",
    items: ["Caesar Salad", "Lemonade"],
  },
  {
    id: "3",
    customerName: "John Smith",
    date: "January 24, 2025",
    rating: 4,
    comment: "Good food overall, but the waiting time was a bit long during lunch hour.",
    items: ["Burger Combo", "Fries", "Coke"],
  },
  {
    id: "4",
    customerName: "Sarah Johnson",
    date: "January 23, 2025",
    rating: 4,
    comment: "Tasty meals and friendly staff. Would love to see more vegetarian options.",
    items: ["Pasta Primavera", "Garlic Bread"],
  },
  {
    id: "5",
    customerName: "Michael Chen",
    date: "January 22, 2025",
    rating: 3,
    comment: "Decent food but a bit pricey for the portion size.",
    items: ["Fish and Chips"],
  },
  {
    id: "6",
    customerName: "Emily Davis",
    date: "January 21, 2025",
    rating: 2,
    comment: "Food was cold when served. Not very satisfied with the quality today.",
    items: ["Pizza Slice", "Water"],
  },
];

import SharedSidebar from "../components/shared-sidebar";

export default function CustomerFeedback() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const distribution = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    mockFeedback.forEach((feedback) => {
      dist[feedback.rating]++;
    });
    return dist;
  }, []);

  const counts = useMemo(() => {
    const c = { all: mockFeedback.length, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    mockFeedback.forEach((feedback) => {
      c[feedback.rating]++;
    });
    return c;
  }, []);

  const filteredAndSortedFeedback = useMemo(() => {
    let filtered = mockFeedback;

    if (activeFilter !== "all") {
      filtered = filtered.filter((feedback) => feedback.rating === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "highest") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      sorted.sort((a, b) => a.rating - b.rating);
    }

    return sorted;
  }, [searchQuery, activeFilter, sortBy]);

  return (
    <SharedSidebar>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Customer Feedback</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-60 md:w-80 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Page Header */}
        <div className="bg-[#6B8E23] text-white p-4 sm:p-6 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Customer Feedback</h2>
          <p className="text-green-100 mt-1 text-sm sm:text-base">Review and analyze customer comments and ratings</p>
        </div>

        <RatingDistribution distribution={distribution} />

        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center justify-between">
          <FilterPills
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40 text-sm" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Customer Review</h2>
          <div className="space-y-3 sm:space-y-4">
            {filteredAndSortedFeedback.length > 0 ? (
              filteredAndSortedFeedback.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  customerName={feedback.customerName}
                  date={feedback.date}
                  rating={feedback.rating}
                  comment={feedback.comment}
                  items={feedback.items}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No feedback found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </SharedSidebar>
  );
}