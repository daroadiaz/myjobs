import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobApplication, ApplicationStatus } from '../models/job-application.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/job-applications`;

  createJobApplication(application: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, application);
  }

  getJobApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  getMyApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/my-applications`);
  }

  getApplicationsByEmployer(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/employer`);
  }

  getApplicationsByJobOfferId(jobOfferId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/job-offer/${jobOfferId}`);
  }

  updateApplicationStatus(id: number, status: ApplicationStatus, comments?: string): Observable<JobApplication> {
    const params = new HttpParams()
      .set('status', status)
      .set('comments', comments || '');
    return this.http.patch<JobApplication>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  deleteJobApplication(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
