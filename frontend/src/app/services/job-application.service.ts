import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  applyToJob(jobOfferId: number, application: Partial<JobApplication>): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.apiUrl}/job-offer/${jobOfferId}`, application);
  }

  getJobApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  getMyApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/my-applications`);
  }

  getApplicationsForMyJobs(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/received`);
  }

  getApplicationsByJobOfferId(jobOfferId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/job-offer/${jobOfferId}`);
  }

  updateApplicationStatus(id: number, status: ApplicationStatus): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${id}/status`, { status });
  }

  addEmployerNotes(id: number, notes: string): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${id}/notes`, { notes });
  }

  withdrawApplication(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
