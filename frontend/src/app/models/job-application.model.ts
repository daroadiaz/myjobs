export enum ApplicationStatus {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  CANCELADA = 'CANCELADA'
}

export interface JobApplication {
  id?: number;
  jobOfferId: number;
  jobOfferTitle?: string;
  applicantId?: number;
  applicantName?: string;
  applicantEmail?: string;
  coverLetter: string;
  resumeUrl?: string;
  status?: ApplicationStatus;
  employerComments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
