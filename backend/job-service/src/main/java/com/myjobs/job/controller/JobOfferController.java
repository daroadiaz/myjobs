package com.myjobs.job.controller;

import com.myjobs.job.dto.JobOfferDTO;
import com.myjobs.job.service.JobOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping
    public ResponseEntity<List<JobOfferDTO>> getAllActiveJobOffers() {
        return ResponseEntity.ok(jobOfferService.getAllActiveJobOffers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOfferDTO> getJobOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(jobOfferService.getJobOfferById(id));
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<JobOfferDTO>> getJobOffersByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(jobOfferService.getJobOffersByEmployer(employerId));
    }

    @GetMapping("/my-offers")
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<List<JobOfferDTO>> getMyJobOffers() {
        return ResponseEntity.ok(jobOfferService.getMyJobOffers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobOfferDTO>> searchJobOffers(@RequestParam String q) {
        return ResponseEntity.ok(jobOfferService.searchJobOffers(q));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<JobOfferDTO>> getJobOffersByCategory(@PathVariable String category) {
        return ResponseEntity.ok(jobOfferService.getJobOffersByCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(jobOfferService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<JobOfferDTO> createJobOffer(@RequestBody JobOfferDTO dto) {
        return ResponseEntity.ok(jobOfferService.createJobOffer(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLEADOR', 'MODERADOR')")
    public ResponseEntity<JobOfferDTO> updateJobOffer(@PathVariable Long id, @RequestBody JobOfferDTO dto) {
        return ResponseEntity.ok(jobOfferService.updateJobOffer(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLEADOR', 'MODERADOR')")
    public ResponseEntity<Map<String, String>> deleteJobOffer(@PathVariable Long id) {
        jobOfferService.deleteJobOffer(id);
        return ResponseEntity.ok(Map.of("message", "Oferta eliminada exitosamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLEADOR', 'MODERADOR')")
    public ResponseEntity<JobOfferDTO> updateJobOfferStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        return ResponseEntity.ok(jobOfferService.updateJobOfferStatus(id, statusRequest.get("status")));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "job-service"));
    }
}
