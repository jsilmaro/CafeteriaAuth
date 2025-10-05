import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      {/* Header Bar */}
      <div className="flex flex-col gap-0 px-12 pt-8 bg-white border-b">
        <div className="flex items-center gap-8">
          <span className="text-[2rem] font-bold text-[#6A972E] tracking-tight">FASPeCC</span>
          <div className="relative w-[340px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6A972E]" />
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-2 w-full border border-[#6A972E] rounded-full focus:outline-none bg-white text-gray-900"
              style={{ fontSize: '1rem' }}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A972E]">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          </div>
        </div>
        <div className="bg-[#6B8E23] text-white px-8 py-6 rounded-lg flex items-center justify-between shadow mt-6 mb-2">
          <div>
            <h2 className="text-3xl font-bold">Customer Feedback</h2>
            <p className="text-lg mt-2">Review and analyze customer comments and ratings.</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <RatingDistribution distribution={distribution} />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <FilterPills
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40" data-testid="select-sort">
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
          <h2 className="text-lg font-semibold mb-4">Customer Review</h2>
          <div className="space-y-4">
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