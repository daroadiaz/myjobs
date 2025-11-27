package com.myjobs.controller;

import com.myjobs.dto.ApiResponse;
import com.myjobs.dto.JobApplicationDTO;
import com.myjobs.enums.ApplicationStatus;
import com.myjobs.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<JobApplicationDTO> createJobApplication(@Valid @RequestBody JobApplicationDTO dto) {
        JobApplicationDTO createdApplication = jobApplicationService.createJobApplication(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getJobApplicationById(@PathVariable Long id) {
        JobApplicationDTO application = jobApplicationService.getJobApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @GetMapping
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<List<JobApplicationDTO>> getAllJobApplications() {
        List<JobApplicationDTO> applications = jobApplicationService.getAllJobApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications() {
        List<JobApplicationDTO> applications = jobApplicationService.getMyApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsByEmployer() {
        List<JobApplicationDTO> applications = jobApplicationService.getApplicationsByEmployer();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job-offer/{jobOfferId}")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsByJobOfferId(@PathVariable Long jobOfferId) {
        List<JobApplicationDTO> applications = jobApplicationService.getApplicationsByJobOfferId(jobOfferId);
        return ResponseEntity.ok(applications);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String comments) {
        JobApplicationDTO updatedApplication = jobApplicationService.updateApplicationStatus(id, status, comments);
        return ResponseEntity.ok(updatedApplication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJobApplication(@PathVariable Long id) {
        jobApplicationService.deleteJobApplication(id);
        return ResponseEntity.ok(ApiResponse.success("Aplicación eliminada correctamente"));
    }
}
