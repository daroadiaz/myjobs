package com.myjobs.worker.service;

import com.myjobs.worker.dto.UserDTO;
import com.myjobs.worker.dto.WorkerServiceDTO;
import com.myjobs.worker.entity.WorkerService;
import com.myjobs.worker.enums.ServiceStatus;
import com.myjobs.worker.repository.WorkerServiceRepository;
import com.myjobs.worker.security.UserPrincipal;
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
public class WorkerServiceService {

    private final WorkerServiceRepository workerServiceRepository;
    private final RestTemplate restTemplate;

    @Value("${user.service.url:http://user-service:8082}")
    private String userServiceUrl;

    @Value("${review.service.url:http://review-service:8085}")
    private String reviewServiceUrl;

    public List<WorkerServiceDTO> getAllActiveServices() {
        return workerServiceRepository.findByStatusOrderByCreatedAtDesc(ServiceStatus.ACTIVO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WorkerServiceDTO getServiceById(Long id) {
        WorkerService service = workerServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        return convertToDTO(service);
    }

    public List<WorkerServiceDTO> getServicesByWorker(Long workerId) {
        return workerServiceRepository.findByWorkerIdOrderByCreatedAtDesc(workerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> getMyServices() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return getServicesByWorker(principal.getId());
    }

    public List<WorkerServiceDTO> searchServices(String query) {
        return workerServiceRepository.searchActiveServices(query, ServiceStatus.ACTIVO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> getServicesByCategory(String category) {
        return workerServiceRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, ServiceStatus.ACTIVO).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return workerServiceRepository.findAllCategories();
    }

    @Transactional
    public WorkerServiceDTO createService(WorkerServiceDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        WorkerService service = WorkerService.builder()
                .workerId(principal.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .location(dto.getLocation())
                .status(ServiceStatus.ACTIVO)
                .pricePerHour(dto.getPricePerHour())
                .pricePerProject(dto.getPricePerProject())
                .pricingType(dto.getPricingType())
                .skills(dto.getSkills())
                .experienceYears(dto.getExperienceYears())
                .portfolio(dto.getPortfolio())
                .availability(dto.getAvailability())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .build();

        service = workerServiceRepository.save(service);
        return convertToDTO(service);
    }

    @Transactional
    public WorkerServiceDTO updateService(Long id, WorkerServiceDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        WorkerService service = workerServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        if (!service.getWorkerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para editar este servicio");
        }

        if (dto.getTitle() != null) service.setTitle(dto.getTitle());
        if (dto.getDescription() != null) service.setDescription(dto.getDescription());
        if (dto.getCategory() != null) service.setCategory(dto.getCategory());
        if (dto.getLocation() != null) service.setLocation(dto.getLocation());
        if (dto.getPricePerHour() != null) service.setPricePerHour(dto.getPricePerHour());
        if (dto.getPricePerProject() != null) service.setPricePerProject(dto.getPricePerProject());
        if (dto.getPricingType() != null) service.setPricingType(dto.getPricingType());
        if (dto.getSkills() != null) service.setSkills(dto.getSkills());
        if (dto.getExperienceYears() != null) service.setExperienceYears(dto.getExperienceYears());
        if (dto.getPortfolio() != null) service.setPortfolio(dto.getPortfolio());
        if (dto.getAvailability() != null) service.setAvailability(dto.getAvailability());
        if (dto.getContactEmail() != null) service.setContactEmail(dto.getContactEmail());
        if (dto.getContactPhone() != null) service.setContactPhone(dto.getContactPhone());
        if (dto.getStatus() != null) service.setStatus(ServiceStatus.valueOf(dto.getStatus()));

        service = workerServiceRepository.save(service);
        return convertToDTO(service);
    }

    @Transactional
    public void deleteService(Long id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        WorkerService service = workerServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        if (!service.getWorkerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para eliminar este servicio");
        }

        workerServiceRepository.delete(service);
    }

    @Transactional
    public WorkerServiceDTO updateServiceStatus(Long id, String status) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        WorkerService service = workerServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        if (!service.getWorkerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para modificar este servicio");
        }

        service.setStatus(ServiceStatus.valueOf(status));
        service = workerServiceRepository.save(service);
        return convertToDTO(service);
    }

    private WorkerServiceDTO convertToDTO(WorkerService service) {
        String workerName = null;
        try {
            UserDTO worker = restTemplate.getForObject(
                    userServiceUrl + "/users/" + service.getWorkerId(),
                    UserDTO.class
            );
            if (worker != null) {
                workerName = worker.getFirstName() + " " + worker.getLastName();
            }
        } catch (Exception e) {
            workerName = "Usuario #" + service.getWorkerId();
        }

        Double averageRating = null;
        Integer reviewCount = 0;
        try {
            averageRating = restTemplate.getForObject(
                    reviewServiceUrl + "/reviews/user/" + service.getWorkerId() + "/average",
                    Double.class
            );
        } catch (Exception e) {
            averageRating = 0.0;
        }

        return WorkerServiceDTO.builder()
                .id(service.getId())
                .workerId(service.getWorkerId())
                .workerName(workerName)
                .title(service.getTitle())
                .description(service.getDescription())
                .category(service.getCategory())
                .location(service.getLocation())
                .status(service.getStatus().name())
                .pricePerHour(service.getPricePerHour())
                .pricePerProject(service.getPricePerProject())
                .pricingType(service.getPricingType())
                .skills(service.getSkills())
                .experienceYears(service.getExperienceYears())
                .portfolio(service.getPortfolio())
                .availability(service.getAvailability())
                .contactEmail(service.getContactEmail())
                .contactPhone(service.getContactPhone())
                .createdAt(service.getCreatedAt())
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .build();
    }
}
