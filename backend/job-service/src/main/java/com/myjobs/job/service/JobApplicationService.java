package com.myjobs.job.service;

import com.myjobs.job.dto.JobApplicationDTO;
import com.myjobs.job.dto.UserDTO;
import com.myjobs.job.entity.JobApplication;
import com.myjobs.job.entity.JobOffer;
import com.myjobs.job.enums.ApplicationStatus;
import com.myjobs.job.repository.JobApplicationRepository;
import com.myjobs.job.repository.JobOfferRepository;
import com.myjobs.job.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final RestTemplate restTemplate;

    @Value("${user.service.url:http://user-service:8082}")
    private String userServiceUrl;

    public List<JobApplicationDTO> getMyApplications() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jobApplicationRepository.findByApplicantIdOrderByCreatedAtDesc(principal.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobApplicationDTO> getApplicationsForMyJobs() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jobApplicationRepository.findByEmployerIdOrderByCreatedAtDesc(principal.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobApplicationDTO> getApplicationsByJobOffer(Long jobOfferId) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new RuntimeException("Oferta de trabajo no encontrada"));

        if (!jobOffer.getEmployerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para ver estas postulaciones");
        }

        return jobApplicationRepository.findByJobOfferIdOrderByCreatedAtDesc(jobOfferId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JobApplicationDTO getApplicationById(Long id) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));
        return convertToDTO(application);
    }

    @Transactional
    public JobApplicationDTO applyToJob(Long jobOfferId, JobApplicationDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new RuntimeException("Oferta de trabajo no encontrada"));

        if (jobApplicationRepository.existsByJobOfferIdAndApplicantId(jobOfferId, principal.getId())) {
            throw new RuntimeException("Ya has postulado a esta oferta");
        }

        JobApplication application = JobApplication.builder()
                .jobOffer(jobOffer)
                .applicantId(principal.getId())
                .status(ApplicationStatus.PENDIENTE)
                .coverLetter(dto.getCoverLetter())
                .resumeUrl(dto.getResumeUrl())
                .build();

        application = jobApplicationRepository.save(application);
        return convertToDTO(application);
    }

    @Transactional
    public JobApplicationDTO updateApplicationStatus(Long id, String status) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

        if (!application.getJobOffer().getEmployerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para actualizar esta postulación");
        }

        application.setStatus(ApplicationStatus.valueOf(status));
        application = jobApplicationRepository.save(application);
        return convertToDTO(application);
    }

    @Transactional
    public JobApplicationDTO addEmployerNotes(Long id, String notes) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

        if (!application.getJobOffer().getEmployerId().equals(principal.getId())) {
            throw new RuntimeException("No tienes permiso para agregar notas a esta postulación");
        }

        application.setEmployerNotes(notes);
        application = jobApplicationRepository.save(application);
        return convertToDTO(application);
    }

    @Transactional
    public void withdrawApplication(Long id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada"));

        if (!application.getApplicantId().equals(principal.getId())) {
            throw new RuntimeException("No tienes permiso para retirar esta postulación");
        }

        jobApplicationRepository.delete(application);
    }

    private JobApplicationDTO convertToDTO(JobApplication application) {
        String applicantName = null;
        String applicantEmail = null;

        try {
            UserDTO applicant = restTemplate.getForObject(
                    userServiceUrl + "/users/" + application.getApplicantId(),
                    UserDTO.class
            );
            if (applicant != null) {
                applicantName = applicant.getFirstName() + " " + applicant.getLastName();
                applicantEmail = applicant.getEmail();
            }
        } catch (Exception e) {
            applicantName = "Usuario #" + application.getApplicantId();
        }

        return JobApplicationDTO.builder()
                .id(application.getId())
                .jobOfferId(application.getJobOffer().getId())
                .jobTitle(application.getJobOffer().getTitle())
                .applicantId(application.getApplicantId())
                .applicantName(applicantName)
                .applicantEmail(applicantEmail)
                .status(application.getStatus().name())
                .coverLetter(application.getCoverLetter())
                .resumeUrl(application.getResumeUrl())
                .employerNotes(application.getEmployerNotes())
                .createdAt(application.getCreatedAt())
                .build();
    }
}
