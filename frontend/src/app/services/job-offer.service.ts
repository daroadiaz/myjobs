import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobOffer, JobStatus } from '../models/job-offer.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/job-offers`;

  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.apiUrl, jobOffer);
  }

  getJobOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
  }

  getAllJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.apiUrl);
  }

  getMyJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/my-offers`);
  }

  getJobOffersByEmployerId(employerId: number): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/employer/${employerId}`);
  }

  searchJobOffers(query: string): Observable<JobOffer[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<JobOffer[]>(`${this.apiUrl}/search`, { params });
  }

  getJobOffersByCategory(category: string): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/category/${category}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  updateJobOffer(id: number, jobOffer: Partial<JobOffer>): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, jobOffer);
  }

  deleteJobOffer(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  updateJobOfferStatus(id: number, status: JobStatus): Observable<JobOffer> {
    return this.http.patch<JobOffer>(`${this.apiUrl}/${id}/status`, { status });
  }
}
