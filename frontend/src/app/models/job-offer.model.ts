export enum JobStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  CERRADO = 'CERRADO'
}

export interface JobOffer {
  id?: number;
  title: string;
  description: string;
  category: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  jobType?: string;
  requirements?: string;
  benefits?: string;
  status?: JobStatus;
  expiresAt?: Date;
  views?: number;
  employerId?: number;
  employerName?: string;
  employerEmail?: string;
  moderatorId?: number;
  moderatorComments?: string;
  createdAt?: Date;
  updatedAt?: Date;
  applicationCount?: number;
}
