import userRatingsData from "@/services/mockData/userRatings.json";

class UserRatingService {
  constructor() {
    this.userRatings = [...userRatingsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.userRatings];
  }

  async getById(id) {
    await this.delay();
    return this.userRatings.find(rating => rating.Id === id) || null;
  }

  async getByWineId(wineId) {
    await this.delay();
    return this.userRatings.find(rating => rating.wineId === wineId) || null;
  }

  async getFavorites() {
    await this.delay();
    return this.userRatings.filter(rating => rating.isFavorite);
  }

  async create(ratingData) {
    await this.delay();
    
    const maxId = Math.max(...this.userRatings.map(rating => rating.Id), 0);
    const newRating = {
      Id: maxId + 1,
      userId: "current-user",
      ratedDate: new Date().toISOString(),
      ...ratingData
    };
    
    this.userRatings.push(newRating);
    return { ...newRating };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.userRatings.findIndex(rating => rating.Id === id);
    if (index === -1) {
      throw new Error("Rating not found");
    }
    
    this.userRatings[index] = { 
      ...this.userRatings[index], 
      ...updateData,
      ratedDate: new Date().toISOString()
    };
    return { ...this.userRatings[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.userRatings.findIndex(rating => rating.Id === id);
    if (index === -1) {
      throw new Error("Rating not found");
    }
    
    const deletedRating = this.userRatings[index];
    this.userRatings.splice(index, 1);
    return deletedRating;
  }

  async getRecentRatings(limit = 10) {
    await this.delay();
    
    return [...this.userRatings]
      .sort((a, b) => new Date(b.ratedDate) - new Date(a.ratedDate))
      .slice(0, limit);
  }

  async getRatingsByScore(minScore) {
    await this.delay();
    
    return this.userRatings.filter(rating => rating.rating >= minScore);
  }
}

export default new UserRatingService();