package com.myjobs.controller;

import com.myjobs.dto.ApiResponse;
import com.myjobs.dto.JobOfferDTO;
import com.myjobs.enums.JobStatus;
import com.myjobs.service.JobOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<JobOfferDTO> createJobOffer(@Valid @RequestBody JobOfferDTO dto) {
        JobOfferDTO createdJobOffer = jobOfferService.createJobOffer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobOffer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOfferDTO> getJobOfferById(@PathVariable Long id) {
        JobOfferDTO jobOffer = jobOfferService.getJobOfferByIdAndIncrementViews(id);
        return ResponseEntity.ok(jobOffer);
    }

    @GetMapping
    public ResponseEntity<List<JobOfferDTO>> getAllJobOffers() {
        List<JobOfferDTO> jobOffers = jobOfferService.getApprovedJobOffers();
        return ResponseEntity.ok(jobOffers);
    }

    @GetMapping("/my-offers")
    @PreAuthorize("hasRole('EMPLEADOR')")
    public ResponseEntity<List<JobOfferDTO>> getMyJobOffers() {
        List<JobOfferDTO> jobOffers = jobOfferService.getMyJobOffers();
        return ResponseEntity.ok(jobOffers);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<JobOfferDTO>> getJobOffersByEmployerId(@PathVariable Long employerId) {
        List<JobOfferDTO> jobOffers = jobOfferService.getJobOffersByEmployerId(employerId);
        return ResponseEntity.ok(jobOffers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobOfferDTO>> searchJobOffers(@RequestParam String q) {
        List<JobOfferDTO> jobOffers = jobOfferService.searchJobOffers(q);
        return ResponseEntity.ok(jobOffers);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<List<JobOfferDTO>> getPendingJobOffers() {
        List<JobOfferDTO> jobOffers = jobOfferService.getPendingJobOffers();
        return ResponseEntity.ok(jobOffers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobOfferDTO> updateJobOffer(@PathVariable Long id, @RequestBody JobOfferDTO dto) {
        JobOfferDTO updatedJobOffer = jobOfferService.updateJobOffer(id, dto);
        return ResponseEntity.ok(updatedJobOffer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJobOffer(@PathVariable Long id) {
        jobOfferService.deleteJobOffer(id);
        return ResponseEntity.ok(ApiResponse.success("Oferta laboral eliminada correctamente"));
    }

    @PatchMapping("/{id}/moderate")
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<JobOfferDTO> moderateJobOffer(
            @PathVariable Long id,
            @RequestParam JobStatus status,
            @RequestParam(required = false) String comments) {
        JobOfferDTO moderatedJobOffer = jobOfferService.moderateJobOffer(id, status, comments);
        return ResponseEntity.ok(moderatedJobOffer);
    }
}
