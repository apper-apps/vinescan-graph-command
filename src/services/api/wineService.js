import winesData from "@/services/mockData/wines.json";

class WineService {
  constructor() {
    this.wines = [...winesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.wines];
  }

  async getById(id) {
    await this.delay();
    return this.wines.find(wine => wine.Id === id) || null;
  }

  async getByBarcode(barcode) {
    await this.delay();
    return this.wines.find(wine => wine.barcode === barcode) || null;
  }

  async create(wineData) {
    await this.delay();
    
    const maxId = Math.max(...this.wines.map(wine => wine.Id), 0);
    const newWine = {
      Id: maxId + 1,
      ...wineData,
      averageRating: 0,
      reviewCount: 0
    };
    
    this.wines.push(newWine);
    return { ...newWine };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.wines.findIndex(wine => wine.Id === id);
    if (index === -1) {
      throw new Error("Wine not found");
    }
    
    this.wines[index] = { ...this.wines[index], ...updateData };
    return { ...this.wines[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.wines.findIndex(wine => wine.Id === id);
    if (index === -1) {
      throw new Error("Wine not found");
    }
    
    const deletedWine = this.wines[index];
    this.wines.splice(index, 1);
    return deletedWine;
  }

  async search(query) {
    await this.delay();
    
    const lowerQuery = query.toLowerCase();
    return this.wines.filter(wine =>
      wine.name.toLowerCase().includes(lowerQuery) ||
      wine.vineyard.toLowerCase().includes(lowerQuery) ||
      wine.region?.toLowerCase().includes(lowerQuery) ||
      wine.type.toLowerCase().includes(lowerQuery)
    );
  }

  async getByType(type) {
    await this.delay();
    return this.wines.filter(wine => wine.type === type);
  }
}

export default new WineService();