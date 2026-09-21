export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: string;
  landlordId: string;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  categoryId?: string;
}