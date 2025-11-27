package com.myjobs.controller;

import com.myjobs.dto.ApiResponse;
import com.myjobs.dto.WorkerServiceDTO;
import com.myjobs.enums.ServiceStatus;
import com.myjobs.service.WorkerServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/worker-services")
@RequiredArgsConstructor
public class WorkerServiceController {

    private final WorkerServiceService workerServiceService;

    @PostMapping
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<WorkerServiceDTO> createWorkerService(@Valid @RequestBody WorkerServiceDTO dto) {
        WorkerServiceDTO createdService = workerServiceService.createWorkerService(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerServiceDTO> getWorkerServiceById(@PathVariable Long id) {
        WorkerServiceDTO workerService = workerServiceService.getWorkerServiceByIdAndIncrementViews(id);
        return ResponseEntity.ok(workerService);
    }

    @GetMapping
    public ResponseEntity<List<WorkerServiceDTO>> getAllWorkerServices() {
        List<WorkerServiceDTO> services = workerServiceService.getApprovedWorkerServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/my-services")
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<List<WorkerServiceDTO>> getMyWorkerServices() {
        List<WorkerServiceDTO> services = workerServiceService.getMyWorkerServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<WorkerServiceDTO>> getWorkerServicesByWorkerId(@PathVariable Long workerId) {
        List<WorkerServiceDTO> services = workerServiceService.getWorkerServicesByWorkerId(workerId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/search")
    public ResponseEntity<List<WorkerServiceDTO>> searchWorkerServices(@RequestParam String q) {
        List<WorkerServiceDTO> services = workerServiceService.searchWorkerServices(q);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<List<WorkerServiceDTO>> getPendingWorkerServices() {
        List<WorkerServiceDTO> services = workerServiceService.getPendingWorkerServices();
        return ResponseEntity.ok(services);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerServiceDTO> updateWorkerService(@PathVariable Long id, @RequestBody WorkerServiceDTO dto) {
        WorkerServiceDTO updatedService = workerServiceService.updateWorkerService(id, dto);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteWorkerService(@PathVariable Long id) {
        workerServiceService.deleteWorkerService(id);
        return ResponseEntity.ok(ApiResponse.success("Servicio eliminado correctamente"));
    }

    @PatchMapping("/{id}/moderate")
    @PreAuthorize("hasRole('MODERADOR')")
    public ResponseEntity<WorkerServiceDTO> moderateWorkerService(
            @PathVariable Long id,
            @RequestParam ServiceStatus status,
            @RequestParam(required = false) String comments) {
        WorkerServiceDTO moderatedService = workerServiceService.moderateWorkerService(id, status, comments);
        return ResponseEntity.ok(moderatedService);
    }
}
