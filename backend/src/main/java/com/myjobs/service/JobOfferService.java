package com.myjobs.service;

import com.myjobs.dto.JobOfferDTO;
import com.myjobs.entity.JobOffer;
import com.myjobs.entity.User;
import com.myjobs.enums.JobStatus;
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
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;

    @Transactional
    public JobOfferDTO createJobOffer(JobOfferDTO dto) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != Role.EMPLEADOR) {
            throw new BadRequestException("Solo los empleadores pueden crear ofertas laborales");
        }

        JobOffer jobOffer = new JobOffer();
        jobOffer.setTitle(dto.getTitle());
        jobOffer.setDescription(dto.getDescription());
        jobOffer.setCategory(dto.getCategory());
        jobOffer.setLocation(dto.getLocation());
        jobOffer.setSalaryMin(dto.getSalaryMin());
        jobOffer.setSalaryMax(dto.getSalaryMax());
        jobOffer.setSalaryPeriod(dto.getSalaryPeriod());
        jobOffer.setJobType(dto.getJobType());
        jobOffer.setRequirements(dto.getRequirements());
        jobOffer.setBenefits(dto.getBenefits());
        jobOffer.setExpiresAt(dto.getExpiresAt());
        jobOffer.setStatus(JobStatus.PENDIENTE);
        jobOffer.setEmployer(currentUser);

        JobOffer savedJobOffer = jobOfferRepository.save(jobOffer);
        return convertToDTO(savedJobOffer);
    }

    public JobOfferDTO getJobOfferById(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", id));
        return convertToDTO(jobOffer);
    }

    @Transactional
    public JobOfferDTO getJobOfferByIdAndIncrementViews(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", id));

        jobOffer.setViews(jobOffer.getViews() + 1);
        jobOfferRepository.save(jobOffer);

        return convertToDTO(jobOffer);
    }

    public List<JobOfferDTO> getAllJobOffers() {
        return jobOfferRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> getApprovedJobOffers() {
        return jobOfferRepository.findApprovedJobOffers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> getPendingJobOffers() {
        return jobOfferRepository.findPendingJobOffers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> getJobOffersByEmployerId(Long employerId) {
        return jobOfferRepository.findByEmployerId(employerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> getMyJobOffers() {
        User currentUser = userService.getCurrentUser();
        return jobOfferRepository.findByEmployerId(currentUser.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobOfferDTO> searchJobOffers(String search) {
        return jobOfferRepository.searchApprovedJobs(search).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobOfferDTO updateJobOffer(Long id, JobOfferDTO dto) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!jobOffer.getEmployer().getId().equals(currentUser.getId())
            && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para actualizar esta oferta");
        }

        if (dto.getTitle() != null) jobOffer.setTitle(dto.getTitle());
        if (dto.getDescription() != null) jobOffer.setDescription(dto.getDescription());
        if (dto.getCategory() != null) jobOffer.setCategory(dto.getCategory());
        if (dto.getLocation() != null) jobOffer.setLocation(dto.getLocation());
        if (dto.getSalaryMin() != null) jobOffer.setSalaryMin(dto.getSalaryMin());
        if (dto.getSalaryMax() != null) jobOffer.setSalaryMax(dto.getSalaryMax());
        if (dto.getSalaryPeriod() != null) jobOffer.setSalaryPeriod(dto.getSalaryPeriod());
        if (dto.getJobType() != null) jobOffer.setJobType(dto.getJobType());
        if (dto.getRequirements() != null) jobOffer.setRequirements(dto.getRequirements());
        if (dto.getBenefits() != null) jobOffer.setBenefits(dto.getBenefits());
        if (dto.getExpiresAt() != null) jobOffer.setExpiresAt(dto.getExpiresAt());

        JobOffer updatedJobOffer = jobOfferRepository.save(jobOffer);
        return convertToDTO(updatedJobOffer);
    }

    @Transactional
    public void deleteJobOffer(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!jobOffer.getEmployer().getId().equals(currentUser.getId())
            && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para eliminar esta oferta");
        }

        jobOfferRepository.delete(jobOffer);
    }

    @Transactional
    public JobOfferDTO moderateJobOffer(Long id, JobStatus status, String comments) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta laboral", "id", id));

        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("Solo los moderadores pueden moderar ofertas");
        }

        jobOffer.setStatus(status);
        jobOffer.setModerator(currentUser);
        jobOffer.setModeratorComments(comments);

        JobOffer updatedJobOffer = jobOfferRepository.save(jobOffer);
        return convertToDTO(updatedJobOffer);
    }

    private JobOfferDTO convertToDTO(JobOffer jobOffer) {
        JobOfferDTO dto = new JobOfferDTO();
        dto.setId(jobOffer.getId());
        dto.setTitle(jobOffer.getTitle());
        dto.setDescription(jobOffer.getDescription());
        dto.setCategory(jobOffer.getCategory());
        dto.setLocation(jobOffer.getLocation());
        dto.setSalaryMin(jobOffer.getSalaryMin());
        dto.setSalaryMax(jobOffer.getSalaryMax());
        dto.setSalaryPeriod(jobOffer.getSalaryPeriod());
        dto.setJobType(jobOffer.getJobType());
        dto.setRequirements(jobOffer.getRequirements());
        dto.setBenefits(jobOffer.getBenefits());
        dto.setStatus(jobOffer.getStatus());
        dto.setExpiresAt(jobOffer.getExpiresAt());
        dto.setViews(jobOffer.getViews());
        dto.setEmployerId(jobOffer.getEmployer().getId());
        dto.setEmployerName(jobOffer.getEmployer().getFirstName() + " " + jobOffer.getEmployer().getLastName());
        dto.setEmployerEmail(jobOffer.getEmployer().getEmail());

        if (jobOffer.getModerator() != null) {
            dto.setModeratorId(jobOffer.getModerator().getId());
        }
        dto.setModeratorComments(jobOffer.getModeratorComments());
        dto.setCreatedAt(jobOffer.getCreatedAt());
        dto.setUpdatedAt(jobOffer.getUpdatedAt());

        // Contar aplicaciones
        Long applicationCount = jobApplicationRepository.countByJobOfferId(jobOffer.getId());
        dto.setApplicationCount(applicationCount);

        return dto;
    }
}
