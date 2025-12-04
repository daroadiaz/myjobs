import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review } from '../models/review.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getReviewsByUserId(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  getReviewsByReviewer(reviewerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviewer/${reviewerId}`);
  }

  getReviewsByJobOffer(jobOfferId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/job-offer/${jobOfferId}`);
  }

  getReviewsByService(serviceId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  getUserAverageRating(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/average`);
  }

  getUserReviewCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/count`);
  }

  updateReview(id: number, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  deleteReview(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
