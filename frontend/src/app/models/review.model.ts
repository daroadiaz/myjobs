export interface Review {
  id?: number;
  userId: number;
  userName?: string;
  reviewerId?: number;
  reviewerName?: string;
  rating: number;
  comment?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
