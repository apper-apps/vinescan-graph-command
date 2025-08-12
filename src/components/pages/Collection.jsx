import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import WineCard from "@/components/organisms/WineCard";
import WineFilters from "@/components/organisms/WineFilters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import wineService from "@/services/api/wineService";
import userRatingService from "@/services/api/userRatingService";

const Collection = () => {
  const [wines, setWines] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [filteredWines, setFilteredWines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    rating: "all",
    favoritesOnly: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  const loadData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [winesData, ratingsData] = await Promise.all([
        wineService.getAll(),
        userRatingService.getAll()
      ]);
      
      // Only show wines that the user has rated
      const ratedWineIds = ratingsData.map(rating => rating.wineId);
      const ratedWines = winesData.filter(wine => ratedWineIds.includes(wine.Id));
      
      setWines(ratedWines);
      setUserRatings(ratingsData);
      setFilteredWines(ratedWines);
    } catch (err) {
      console.error("Error loading collection:", err);
      setError("Failed to load your wine collection");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    let filtered = [...wines];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(wine =>
        wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wine.vineyard.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wine.region?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filters.type !== "all") {
      filtered = filtered.filter(wine => wine.type === filters.type);
    }
    
    // Apply rating filter
    if (filters.rating !== "all") {
      const minRating = parseInt(filters.rating);
      filtered = filtered.filter(wine => {
        const userRating = userRatings.find(rating => rating.wineId === wine.Id);
        return userRating && userRating.rating >= minRating;
      });
    }
    
    // Apply favorites filter
    if (filters.favoritesOnly) {
      filtered = filtered.filter(wine => {
        const userRating = userRatings.find(rating => rating.wineId === wine.Id);
        return userRating && userRating.isFavorite;
      });
    }
    
    setFilteredWines(filtered);
  }, [wines, userRatings, searchQuery, filters]);
  
  const handleFavoriteToggle = async (wineId) => {
    try {
      const userRating = userRatings.find(rating => rating.wineId === wineId);
      
      if (userRating) {
        await userRatingService.update(userRating.Id, {
          ...userRating,
          isFavorite: !userRating.isFavorite
        });
        
        // Update local state
        const updatedRatings = userRatings.map(rating =>
          rating.Id === userRating.Id
            ? { ...rating, isFavorite: !rating.isFavorite }
            : rating
        );
        setUserRatings(updatedRatings);
        
        toast.success(
          !userRating.isFavorite 
            ? "Added to favorites!" 
            : "Removed from favorites"
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  
  const handleClearFilters = () => {
    setFilters({
      type: "all",
      rating: "all",
      favoritesOnly: false
    });
    setSearchQuery("");
  };
  
  const getTotalStats = () => {
    const totalWines = wines.length;
    const favorites = userRatings.filter(rating => rating.isFavorite).length;
    const averageRating = userRatings.length > 0
      ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length
      : 0;
    
    return { totalWines, favorites, averageRating };
  };
  
  const stats = getTotalStats();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
        <div className="container mx-auto px-4 py-6">
          <Loading type="wine-grid" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
        <div className="container mx-auto px-4 py-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-wine-burgundy mb-1">
              My Collection
            </h1>
            <p className="text-gray-600">
              {stats.totalWines} wines • {stats.favorites} favorites
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/add-wine")}
            size="sm"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Wine
          </Button>
        </div>
        
        {wines.length === 0 ? (
          <Empty type="collection" />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wine-burgundy">
                    {stats.totalWines}
                  </div>
                  <div className="text-sm text-gray-600">Total Wines</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wine-red">
                    {stats.favorites}
                  </div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wine-gold">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={handleClearSearch}
                  placeholder="Search wines, vineyards, or regions..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <ApperIcon name="Filter" size={16} className="mr-2" />
                  Filters
                </Button>
              </div>
              
              {showFilters && (
                <Card>
                  <CardContent className="p-4">
                    <WineFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={handleClearFilters}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Wine Grid */}
            {filteredWines.length === 0 ? (
              <Empty 
                type="search"
                title="No wines match your criteria"
                message="Try adjusting your search terms or filters to see more wines."
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWines.map((wine) => {
                  const userRating = userRatings.find(rating => rating.wineId === wine.Id);
                  return (
                    <WineCard
                      key={wine.Id}
                      wine={wine}
                      userRating={userRating}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;