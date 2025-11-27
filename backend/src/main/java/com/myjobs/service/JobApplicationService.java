package com.myjobs.service;

import com.myjobs.dto.JobApplicationDTO;
import com.myjobs.entity.JobApplication;
import com.myjobs.entity.JobOffer;
import com.myjobs.entity.User;
import com.myjobs.enums.ApplicationStatus;
import com.myjobs.enums.Role;
import com.myjobs.exception.BadRequestException;
import com.myjobs.exception.ResourceNotFoundException;
import com.myjobs.repository.JobApplicationRepository;
import com.myjobs.repository.JobOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final UserService userService;

    @Transactional
    public JobApplicationDTO createJobApplication(JobApplicationDTO dto) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != Role.TRABAJADOR) {
            throw new BadRequestException("Solo los trabajadores pueden aplicar a ofertas laborales");
        }

        JobOffer jobOffer = jobOfferRepository.findById(dto.getJobOfferId())
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", dto.getJobOfferId()));

        // Verificar si ya aplicó
        if (jobApplicationRepository.existsByJobOfferAndApplicant(jobOffer, currentUser)) {
            throw new BadRequestException("Ya has aplicado a esta oferta laboral");
        }

        JobApplication application = new JobApplication();
        application.setJobOffer(jobOffer);
        application.setApplicant(currentUser);
        application.setCoverLetter(dto.getCoverLetter());
        application.setResumeUrl(dto.getResumeUrl());
        application.setStatus(ApplicationStatus.PENDIENTE);

        JobApplication savedApplication = jobApplicationRepository.save(application);
        return convertToDTO(savedApplication);
    }

    public JobApplicationDTO getJobApplicationById(Long id) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aplicación", "id", id));
        return convertToDTO(application);
    }

    public List<JobApplicationDTO> getAllJobApplications() {
        return jobApplicationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobApplicationDTO> getMyApplications() {
        User currentUser = userService.getCurrentUser();
        return jobApplicationRepository.findByApplicantId(currentUser.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobApplicationDTO> getApplicationsByEmployer() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.EMPLEADOR) {
            throw new BadRequestException("Solo los empleadores pueden ver aplicaciones a sus ofertas");
        }
        return jobApplicationRepository.findApplicationsByEmployerId(currentUser.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobApplicationDTO> getApplicationsByJobOfferId(Long jobOfferId) {
        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", jobOfferId));

        User currentUser = userService.getCurrentUser();
        if (!jobOffer.getEmployer().getId().equals(currentUser.getId())
            && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para ver estas aplicaciones");
        }

        return jobApplicationRepository.findByJobOffer(jobOffer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationDTO updateApplicationStatus(Long id, ApplicationStatus status, String comments) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aplicación", "id", id));

        User currentUser = userService.getCurrentUser();

        // Solo el empleador dueño de la oferta o el aplicante pueden actualizar
        boolean isEmployer = application.getJobOffer().getEmployer().getId().equals(currentUser.getId());
        boolean isApplicant = application.getApplicant().getId().equals(currentUser.getId());

        if (!isEmployer && !isApplicant && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para actualizar esta aplicación");
        }

        // El aplicante solo puede cancelar
        if (isApplicant && !isEmployer && status != ApplicationStatus.CANCELADA) {
            throw new BadRequestException("Solo puedes cancelar tu aplicación");
        }

        application.setStatus(status);
        if (comments != null) {
            application.setEmployerComments(comments);
        }

        JobApplication updatedApplication = jobApplicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    @Transactional
    public void deleteJobApplication(Long id) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aplicación", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!application.getApplicant().getId().equals(currentUser.getId())
            && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para eliminar esta aplicación");
        }

        jobApplicationRepository.delete(application);
    }

    private JobApplicationDTO convertToDTO(JobApplication application) {
        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setId(application.getId());
        dto.setJobOfferId(application.getJobOffer().getId());
        dto.setJobOfferTitle(application.getJobOffer().getTitle());
        dto.setApplicantId(application.getApplicant().getId());
        dto.setApplicantName(application.getApplicant().getFirstName() + " " + application.getApplicant().getLastName());
        dto.setApplicantEmail(application.getApplicant().getEmail());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setResumeUrl(application.getResumeUrl());
        dto.setStatus(application.getStatus());
        dto.setEmployerComments(application.getEmployerComments());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        return dto;
    }
}
