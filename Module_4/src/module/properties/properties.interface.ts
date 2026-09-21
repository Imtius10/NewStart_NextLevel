
export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  landlordId: string;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  category?: string;
}

export interface PropertyQuery {
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}