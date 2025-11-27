export enum ServiceStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  INACTIVO = 'INACTIVO'
}

export interface WorkerService {
  id?: number;
  title: string;
  description: string;
  category: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  pricePeriod?: string;
  skills?: string;
  portfolio?: string;
  experienceYears?: string;
  availability?: string;
  status?: ServiceStatus;
  views?: number;
  workerId?: number;
  workerName?: string;
  workerEmail?: string;
  moderatorId?: number;
  moderatorComments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
