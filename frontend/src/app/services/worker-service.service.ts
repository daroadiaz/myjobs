import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WorkerService, ServiceStatus } from '../models/worker-service.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class WorkerServiceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/worker-services`;

  createWorkerService(service: WorkerService): Observable<WorkerService> {
    return this.http.post<WorkerService>(this.apiUrl, service);
  }

  getWorkerServiceById(id: number): Observable<WorkerService> {
    return this.http.get<WorkerService>(`${this.apiUrl}/${id}`);
  }

  getAllWorkerServices(): Observable<WorkerService[]> {
    return this.http.get<WorkerService[]>(this.apiUrl);
  }

  getMyWorkerServices(): Observable<WorkerService[]> {
    return this.http.get<WorkerService[]>(`${this.apiUrl}/my-services`);
  }

  getWorkerServicesByWorkerId(workerId: number): Observable<WorkerService[]> {
    return this.http.get<WorkerService[]>(`${this.apiUrl}/worker/${workerId}`);
  }

  searchWorkerServices(query: string): Observable<WorkerService[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<WorkerService[]>(`${this.apiUrl}/search`, { params });
  }

  getWorkerServicesByCategory(category: string): Observable<WorkerService[]> {
    return this.http.get<WorkerService[]>(`${this.apiUrl}/category/${category}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  updateWorkerService(id: number, service: Partial<WorkerService>): Observable<WorkerService> {
    return this.http.put<WorkerService>(`${this.apiUrl}/${id}`, service);
  }

  deleteWorkerService(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  updateWorkerServiceStatus(id: number, status: ServiceStatus): Observable<WorkerService> {
    return this.http.patch<WorkerService>(`${this.apiUrl}/${id}/status`, { status });
  }

  getPendingWorkerServices(): Observable<WorkerService[]> {
    return this.http.get<WorkerService[]>(`${this.apiUrl}/pending`);
  }

  moderateWorkerService(id: number, status: ServiceStatus, comments?: string): Observable<WorkerService> {
    return this.http.patch<WorkerService>(`${this.apiUrl}/${id}/moderate`, { status, moderatorComments: comments });
  }
}
