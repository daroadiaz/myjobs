package com.myjobs.job.service;

import com.myjobs.job.dto.JobOfferDTO;
import com.myjobs.job.dto.UserDTO;
import com.myjobs.job.entity.JobOffer;
import com.myjobs.job.enums.JobStatus;
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
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final RestTemplate restTemplate;

    @Value("${user.service.url:http://user-service:8082}")
    private String userServiceUrl;

    public List<JobOfferDTO> getAllActiveJobOffers() {
        return jobOfferRepository.findByStatusOrderByCreatedAtDesc(JobStatus.ACTIVO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JobOfferDTO getJobOfferById(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta de trabajo no encontrada"));
        return convertToDTO(jobOffer);
    }

    public List<JobOfferDTO> getJobOffersByEmployer(Long employerId) {
        return jobOfferRepository.findByEmployerIdOrderByCreatedAtDesc(employerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> getMyJobOffers() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return getJobOffersByEmployer(principal.getId());
    }

    public List<JobOfferDTO> searchJobOffers(String query) {
        return jobOfferRepository.searchActiveJobOffers(query, JobStatus.ACTIVO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> getJobOffersByCategory(String category) {
        return jobOfferRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, JobStatus.ACTIVO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return jobOfferRepository.findAllCategories();
    }

    @Transactional
    public JobOfferDTO createJobOffer(JobOfferDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobOffer jobOffer = JobOffer.builder()
                .employerId(principal.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .location(dto.getLocation())
                .status(JobStatus.ACTIVO)
                .salaryMin(dto.getSalaryMin())
                .salaryMax(dto.getSalaryMax())
                .salaryPeriod(dto.getSalaryPeriod())
                .workType(dto.getWorkType())
                .experienceLevel(dto.getExperienceLevel())
                .requirements(dto.getRequirements())
                .benefits(dto.getBenefits())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .build();

        jobOffer = jobOfferRepository.save(jobOffer);
        return convertToDTO(jobOffer);
    }

    @Transactional
    public JobOfferDTO updateJobOffer(Long id, JobOfferDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta de trabajo no encontrada"));

        if (!jobOffer.getEmployerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para editar esta oferta");
        }

        if (dto.getTitle() != null) jobOffer.setTitle(dto.getTitle());
        if (dto.getDescription() != null) jobOffer.setDescription(dto.getDescription());
        if (dto.getCategory() != null) jobOffer.setCategory(dto.getCategory());
        if (dto.getLocation() != null) jobOffer.setLocation(dto.getLocation());
        if (dto.getSalaryMin() != null) jobOffer.setSalaryMin(dto.getSalaryMin());
        if (dto.getSalaryMax() != null) jobOffer.setSalaryMax(dto.getSalaryMax());
        if (dto.getSalaryPeriod() != null) jobOffer.setSalaryPeriod(dto.getSalaryPeriod());
        if (dto.getWorkType() != null) jobOffer.setWorkType(dto.getWorkType());
        if (dto.getExperienceLevel() != null) jobOffer.setExperienceLevel(dto.getExperienceLevel());
        if (dto.getRequirements() != null) jobOffer.setRequirements(dto.getRequirements());
        if (dto.getBenefits() != null) jobOffer.setBenefits(dto.getBenefits());
        if (dto.getContactEmail() != null) jobOffer.setContactEmail(dto.getContactEmail());
        if (dto.getContactPhone() != null) jobOffer.setContactPhone(dto.getContactPhone());
        if (dto.getStatus() != null) jobOffer.setStatus(JobStatus.valueOf(dto.getStatus()));

        jobOffer = jobOfferRepository.save(jobOffer);
        return convertToDTO(jobOffer);
    }

    @Transactional
    public void deleteJobOffer(Long id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta de trabajo no encontrada"));

        if (!jobOffer.getEmployerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para eliminar esta oferta");
        }

        jobOfferRepository.delete(jobOffer);
    }

    @Transactional
    public JobOfferDTO updateJobOfferStatus(Long id, String status) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta de trabajo no encontrada"));

        if (!jobOffer.getEmployerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para modificar esta oferta");
        }

        jobOffer.setStatus(JobStatus.valueOf(status));
        jobOffer = jobOfferRepository.save(jobOffer);
        return convertToDTO(jobOffer);
    }

    private JobOfferDTO convertToDTO(JobOffer jobOffer) {
        String employerName = null;
        try {
            UserDTO employer = restTemplate.getForObject(
                    userServiceUrl + "/users/" + jobOffer.getEmployerId(),
                    UserDTO.class
            );
            if (employer != null) {
                employerName = employer.getFirstName() + " " + employer.getLastName();
            }
        } catch (Exception e) {
            employerName = "Usuario #" + jobOffer.getEmployerId();
        }

        Integer applicationCount = jobApplicationRepository.countByJobOfferId(jobOffer.getId());

        return JobOfferDTO.builder()
                .id(jobOffer.getId())
                .employerId(jobOffer.getEmployerId())
                .employerName(employerName)
                .title(jobOffer.getTitle())
                .description(jobOffer.getDescription())
                .category(jobOffer.getCategory())
                .location(jobOffer.getLocation())
                .status(jobOffer.getStatus().name())
                .salaryMin(jobOffer.getSalaryMin())
                .salaryMax(jobOffer.getSalaryMax())
                .salaryPeriod(jobOffer.getSalaryPeriod())
                .workType(jobOffer.getWorkType())
                .experienceLevel(jobOffer.getExperienceLevel())
                .requirements(jobOffer.getRequirements())
                .benefits(jobOffer.getBenefits())
                .contactEmail(jobOffer.getContactEmail())
                .contactPhone(jobOffer.getContactPhone())
                .createdAt(jobOffer.getCreatedAt())
                .expiresAt(jobOffer.getExpiresAt())
                .applicationCount(applicationCount)
                .build();
    }
}
