import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import WineCard from "@/components/organisms/WineCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import wineService from "@/services/api/wineService";
import userRatingService from "@/services/api/userRatingService";
import userService from "@/services/api/userService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [favoriteWines, setFavoriteWines] = useState([]);
  const [recentRatings, setRecentRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const navigate = useNavigate();
  
  const loadData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [userData, ratingsData, winesData] = await Promise.all([
        userService.getCurrentUser(),
        userRatingService.getAll(),
        wineService.getAll()
      ]);
      
      setUser(userData);
      setUserRatings(ratingsData);
      
      // Get favorite wines
      const favoriteRatings = ratingsData.filter(rating => rating.isFavorite);
      const favoriteWineData = winesData.filter(wine => 
        favoriteRatings.some(rating => rating.wineId === wine.Id)
      );
      setFavoriteWines(favoriteWineData);
      
      // Get recent ratings (last 5)
      const sortedRatings = ratingsData
        .sort((a, b) => new Date(b.ratedDate) - new Date(a.ratedDate))
        .slice(0, 5);
      const recentWineData = winesData.filter(wine => 
        sortedRatings.some(rating => rating.wineId === wine.Id)
      );
      setRecentRatings(recentWineData);
      
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleFavoriteToggle = async (wineId) => {
    try {
      const userRating = userRatings.find(rating => rating.wineId === wineId);
      
      if (userRating) {
        await userRatingService.update(userRating.Id, {
          ...userRating,
          isFavorite: !userRating.isFavorite
        });
        
        // Reload data to reflect changes
        await loadData();
        
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
  
  const getProfileStats = () => {
    const totalRatings = userRatings.length;
    const totalFavorites = userRatings.filter(rating => rating.isFavorite).length;
    const averageRating = totalRatings > 0
      ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
      : 0;
    
    // Wine type distribution
    const typeDistribution = userRatings.reduce((acc, rating) => {
      const wine = favoriteWines.concat(recentRatings).find(w => w.Id === rating.wineId);
      if (wine) {
        acc[wine.type] = (acc[wine.type] || 0) + 1;
      }
      return acc;
    }, {});
    
    const favoriteType = Object.keys(typeDistribution).reduce((a, b) => 
      typeDistribution[a] > typeDistribution[b] ? a : b, "red"
    );
    
    return {
      totalRatings,
      totalFavorites,
      averageRating,
      favoriteType,
      typeDistribution
    };
  };
  
  const stats = user ? getProfileStats() : null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-cream to-wine-beige">
        <div className="container mx-auto px-4 py-6">
          <Loading />
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
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-wine-burgundy to-wine-red rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="User" size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-wine-burgundy mb-2">
            {user?.name || "Wine Enthusiast"}
          </h1>
          <p className="text-gray-600">
            Member since {user ? format(new Date(user.joinedDate), "MMMM yyyy") : "Recently"}
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "stats"
                  ? "bg-wine-burgundy text-white shadow-md"
                  : "text-gray-600 hover:text-wine-burgundy"
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "favorites"
                  ? "bg-wine-burgundy text-white shadow-md"
                  : "text-gray-600 hover:text-wine-burgundy"
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === "recent"
                  ? "bg-wine-burgundy text-white shadow-md"
                  : "text-gray-600 hover:text-wine-burgundy"
              }`}
            >
              Recent
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === "stats" && stats && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-wine-burgundy mb-1">
                    {stats.totalRatings}
                  </div>
                  <div className="text-sm text-gray-600">Wines Rated</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-wine-red mb-1">
                    {stats.totalFavorites}
                  </div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-wine-gold mb-1">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-wine-burgundy mb-1 capitalize">
                    {stats.favoriteType}
                  </div>
                  <div className="text-sm text-gray-600">Preferred Type</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Wine Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Wine Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.typeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${
                          type === "red" ? "bg-red-500" :
                          type === "white" ? "bg-yellow-200" :
                          type === "rose" ? "bg-pink-400" :
                          type === "sparkling" ? "bg-gray-200" :
                          type === "dessert" ? "bg-amber-400" :
                          "bg-orange-600"
                        }`}></div>
                        <span className="capitalize font-medium">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-wine-beige rounded-full h-2">
                          <div 
                            className="bg-wine-burgundy h-2 rounded-full"
                            style={{ width: `${(count / stats.totalRatings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold min-w-[2rem]">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === "favorites" && (
          <div className="max-w-6xl mx-auto">
            {favoriteWines.length === 0 ? (
              <Empty type="favorites" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteWines.map((wine) => {
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
          </div>
        )}
        
        {activeTab === "recent" && (
          <div className="max-w-6xl mx-auto">
            {recentRatings.length === 0 ? (
              <Empty 
                type="wines"
                title="No recent ratings"
                message="Start rating wines to see your recent activity here."
                actionLabel="Scan Wine"
                actionTo="/scanner"
              />
            ) : (
              <>
                <h3 className="text-xl font-semibold text-wine-burgundy mb-6 text-center">
                  Recently Rated Wines
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentRatings.map((wine) => {
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
              </>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate("/scanner")}
            size="lg"
            className="bg-gradient-to-r from-wine-gold to-wine-warning"
          >
            <ApperIcon name="Camera" size={20} className="mr-2" />
            Scan More Wines
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;