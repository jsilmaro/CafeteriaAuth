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
import SharedSidebar from "../components/shared-sidebar";
import { useAllFeedback } from "../hooks/use-feedback"; // ⭐ make sure this is created!

export default function CustomerFeedback() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ⭐ Fetch real feedback from backend
  const { data: feedback = [], isLoading } = useAllFeedback();

  // ⭐ Build rating distribution (1–5)
  const distribution = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach((fb) => {
      dist[fb.rating]++;
    });
    return dist;
  }, [feedback]);

  // ⭐ Pills count
  const counts = useMemo(() => {
    const c = { all: feedback.length, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach((fb) => {
      c[fb.rating]++;
    });
    return c;
  }, [feedback]);

  // ⭐ Filtering + sorting
  const filteredAndSortedFeedback = useMemo(() => {
    let filtered = feedback;

    if (activeFilter !== "all") {
      filtered = filtered.filter((fb) => fb.rating === Number(activeFilter));
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (fb) =>
          fb.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fb.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered];

    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highest") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      sorted.sort((a, b) => a.rating - b.rating);
    }

    return sorted;
  }, [searchQuery, activeFilter, sortBy, feedback]);

  return (
    <SharedSidebar>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                Customer Feedback
              </h1>
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
          <p className="text-green-100 mt-1 text-sm sm:text-base">
            Review and analyze customer comments and ratings
          </p>
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
              <SelectTrigger className="w-full sm:w-40 text-sm">
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

        {/* Feedback List */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Customer Review
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading feedback...
            </div>
          ) : filteredAndSortedFeedback.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredAndSortedFeedback.map((fb) => (
                <FeedbackCard
                  key={fb.id}
                  customerName={fb.user.fullName}
                  date={new Date(fb.createdAt).toLocaleDateString()}
                  rating={fb.rating}
                  comment={fb.comment}
                  items={fb.items || []} // if you don't have items, stays empty
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No feedback found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </SharedSidebar>
  );
}
