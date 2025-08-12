import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getCurrentUser() {
    await this.delay();
    return this.users.find(user => user.Id === "current-user") || null;
  }

  async getById(id) {
    await this.delay();
    return this.users.find(user => user.Id === id) || null;
  }

  async updateProfile(profileData) {
    await this.delay();
    
    const index = this.users.findIndex(user => user.Id === "current-user");
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = { ...this.users[index], ...profileData };
    return { ...this.users[index] };
  }

  async updateStats(totalRatings, favoriteCount) {
    await this.delay();
    
    const index = this.users.findIndex(user => user.Id === "current-user");
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = { 
      ...this.users[index], 
      totalRatings,
      favoriteCount 
    };
    return { ...this.users[index] };
  }
}

export default new UserService();