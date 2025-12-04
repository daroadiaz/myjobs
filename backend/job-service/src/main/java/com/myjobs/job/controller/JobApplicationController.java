package com.myjobs.job.controller;

import com.myjobs.job.dto.JobApplicationDTO;
import com.myjobs.job.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications() {
        return ResponseEntity.ok(jobApplicationService.getMyApplications());
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsForMyJobs() {
        return ResponseEntity.ok(jobApplicationService.getApplicationsForMyJobs());
    }

    @GetMapping("/job-offer/{jobOfferId}")
    @PreAuthorize("hasAnyRole('EMPLEADOR', 'MODERADOR')")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsByJobOffer(@PathVariable Long jobOfferId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByJobOffer(jobOfferId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(jobApplicationService.getApplicationById(id));
    }

    @PostMapping("/job-offer/{jobOfferId}")
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<JobApplicationDTO> applyToJob(
            @PathVariable Long jobOfferId,
            @RequestBody JobApplicationDTO dto) {
        return ResponseEntity.ok(jobApplicationService.applyToJob(jobOfferId, dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLEADOR', 'MODERADOR')")
    public ResponseEntity<JobApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(id, statusRequest.get("status")));
    }

    @PatchMapping("/{id}/notes")
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<JobApplicationDTO> addEmployerNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> notesRequest) {
        return ResponseEntity.ok(jobApplicationService.addEmployerNotes(id, notesRequest.get("notes")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<Map<String, String>> withdrawApplication(@PathVariable Long id) {
        jobApplicationService.withdrawApplication(id);
        return ResponseEntity.ok(Map.of("message", "Postulación retirada exitosamente"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "job-application-service"));
    }
}
