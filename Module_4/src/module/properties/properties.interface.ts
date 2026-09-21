export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  landlordId: string;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
}