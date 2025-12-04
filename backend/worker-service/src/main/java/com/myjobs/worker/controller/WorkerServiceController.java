package com.myjobs.worker.controller;

import com.myjobs.worker.dto.WorkerServiceDTO;
import com.myjobs.worker.service.WorkerServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/worker-services")
@RequiredArgsConstructor
public class WorkerServiceController {

    private final WorkerServiceService workerServiceService;

    @GetMapping
    public ResponseEntity<List<WorkerServiceDTO>> getAllActiveServices() {
        return ResponseEntity.ok(workerServiceService.getAllActiveServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerServiceDTO> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(workerServiceService.getServiceById(id));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<WorkerServiceDTO>> getServicesByWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(workerServiceService.getServicesByWorker(workerId));
    }

    @GetMapping("/my-services")
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<List<WorkerServiceDTO>> getMyServices() {
        return ResponseEntity.ok(workerServiceService.getMyServices());
    }

    @GetMapping("/search")
    public ResponseEntity<List<WorkerServiceDTO>> searchServices(@RequestParam String q) {
        return ResponseEntity.ok(workerServiceService.searchServices(q));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<WorkerServiceDTO>> getServicesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(workerServiceService.getServicesByCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(workerServiceService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasRole('TRABAJADOR')")
    public ResponseEntity<WorkerServiceDTO> createService(@RequestBody WorkerServiceDTO dto) {
        return ResponseEntity.ok(workerServiceService.createService(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRABAJADOR', 'MODERADOR')")
    public ResponseEntity<WorkerServiceDTO> updateService(@PathVariable Long id, @RequestBody WorkerServiceDTO dto) {
        return ResponseEntity.ok(workerServiceService.updateService(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRABAJADOR', 'MODERADOR')")
    public ResponseEntity<Map<String, String>> deleteService(@PathVariable Long id) {
        workerServiceService.deleteService(id);
        return ResponseEntity.ok(Map.of("message", "Servicio eliminado exitosamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TRABAJADOR', 'MODERADOR')")
    public ResponseEntity<WorkerServiceDTO> updateServiceStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        return ResponseEntity.ok(workerServiceService.updateServiceStatus(id, statusRequest.get("status")));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "worker-service"));
    }
}
