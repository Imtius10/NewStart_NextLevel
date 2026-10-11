
export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
  landlordId: string;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface PropertyQuery {
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: string;
  limit?: string;
}