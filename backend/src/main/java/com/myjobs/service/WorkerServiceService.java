package com.myjobs.service;

import com.myjobs.dto.WorkerServiceDTO;
import com.myjobs.entity.User;
import com.myjobs.entity.WorkerService;
import com.myjobs.enums.Role;
import com.myjobs.enums.ServiceStatus;
import com.myjobs.exception.BadRequestException;
import com.myjobs.exception.ResourceNotFoundException;
import com.myjobs.repository.WorkerServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerServiceService {

    private final WorkerServiceRepository workerServiceRepository;
    private final UserService userService;

    @Transactional
    public WorkerServiceDTO createWorkerService(WorkerServiceDTO dto) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != Role.TRABAJADOR) {
            throw new BadRequestException("Solo los trabajadores pueden crear servicios");
        }

        WorkerService workerService = new WorkerService();
        workerService.setTitle(dto.getTitle());
        workerService.setDescription(dto.getDescription());
        workerService.setCategory(dto.getCategory());
        workerService.setLocation(dto.getLocation());
        workerService.setPriceMin(dto.getPriceMin());
        workerService.setPriceMax(dto.getPriceMax());
        workerService.setPricePeriod(dto.getPricePeriod());
        workerService.setSkills(dto.getSkills());
        workerService.setPortfolio(dto.getPortfolio());
        workerService.setExperienceYears(dto.getExperienceYears());
        workerService.setAvailability(dto.getAvailability());
        workerService.setStatus(ServiceStatus.PENDIENTE);
        workerService.setWorker(currentUser);

        WorkerService savedService = workerServiceRepository.save(workerService);
        return convertToDTO(savedService);
    }

    public WorkerServiceDTO getWorkerServiceById(Long id) {
        WorkerService workerService = workerServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));
        return convertToDTO(workerService);
    }

    @Transactional
    public WorkerServiceDTO getWorkerServiceByIdAndIncrementViews(Long id) {
        WorkerService workerService = workerServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));

        workerService.setViews(workerService.getViews() + 1);
        workerServiceRepository.save(workerService);

        return convertToDTO(workerService);
    }

    public List<WorkerServiceDTO> getAllWorkerServices() {
        return workerServiceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> getApprovedWorkerServices() {
        return workerServiceRepository.findApprovedServices().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> getPendingWorkerServices() {
        return workerServiceRepository.findPendingServices().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> getWorkerServicesByWorkerId(Long workerId) {
        return workerServiceRepository.findByWorkerId(workerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> getMyWorkerServices() {
        User currentUser = userService.getCurrentUser();
        return workerServiceRepository.findByWorkerId(currentUser.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WorkerServiceDTO> searchWorkerServices(String search) {
        return workerServiceRepository.searchApprovedServices(search).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkerServiceDTO updateWorkerService(Long id, WorkerServiceDTO dto) {
        WorkerService workerService = workerServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!workerService.getWorker().getId().equals(currentUser.getId())
            && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para actualizar este servicio");
        }

        if (dto.getTitle() != null) workerService.setTitle(dto.getTitle());
        if (dto.getDescription() != null) workerService.setDescription(dto.getDescription());
        if (dto.getCategory() != null) workerService.setCategory(dto.getCategory());
        if (dto.getLocation() != null) workerService.setLocation(dto.getLocation());
        if (dto.getPriceMin() != null) workerService.setPriceMin(dto.getPriceMin());
        if (dto.getPriceMax() != null) workerService.setPriceMax(dto.getPriceMax());
        if (dto.getPricePeriod() != null) workerService.setPricePeriod(dto.getPricePeriod());
        if (dto.getSkills() != null) workerService.setSkills(dto.getSkills());
        if (dto.getPortfolio() != null) workerService.setPortfolio(dto.getPortfolio());
        if (dto.getExperienceYears() != null) workerService.setExperienceYears(dto.getExperienceYears());
        if (dto.getAvailability() != null) workerService.setAvailability(dto.getAvailability());

        WorkerService updatedService = workerServiceRepository.save(workerService);
        return convertToDTO(updatedService);
    }

    @Transactional
    public void deleteWorkerService(Long id) {
        WorkerService workerService = workerServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!workerService.getWorker().getId().equals(currentUser.getId())
            && currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("No tienes permisos para eliminar este servicio");
        }

        workerServiceRepository.delete(workerService);
    }

    @Transactional
    public WorkerServiceDTO moderateWorkerService(Long id, ServiceStatus status, String comments) {
        WorkerService workerService = workerServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));

        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.MODERADOR) {
            throw new BadRequestException("Solo los moderadores pueden moderar servicios");
        }

        workerService.setStatus(status);
        workerService.setModerator(currentUser);
        workerService.setModeratorComments(comments);

        WorkerService updatedService = workerServiceRepository.save(workerService);
        return convertToDTO(updatedService);
    }

    private WorkerServiceDTO convertToDTO(WorkerService workerService) {
        WorkerServiceDTO dto = new WorkerServiceDTO();
        dto.setId(workerService.getId());
        dto.setTitle(workerService.getTitle());
        dto.setDescription(workerService.getDescription());
        dto.setCategory(workerService.getCategory());
        dto.setLocation(workerService.getLocation());
        dto.setPriceMin(workerService.getPriceMin());
        dto.setPriceMax(workerService.getPriceMax());
        dto.setPricePeriod(workerService.getPricePeriod());
        dto.setSkills(workerService.getSkills());
        dto.setPortfolio(workerService.getPortfolio());
        dto.setExperienceYears(workerService.getExperienceYears());
        dto.setAvailability(workerService.getAvailability());
        dto.setStatus(workerService.getStatus());
        dto.setViews(workerService.getViews());
        dto.setWorkerId(workerService.getWorker().getId());
        dto.setWorkerName(workerService.getWorker().getFirstName() + " " + workerService.getWorker().getLastName());
        dto.setWorkerEmail(workerService.getWorker().getEmail());

        if (workerService.getModerator() != null) {
            dto.setModeratorId(workerService.getModerator().getId());
        }
        dto.setModeratorComments(workerService.getModeratorComments());
        dto.setCreatedAt(workerService.getCreatedAt());
        dto.setUpdatedAt(workerService.getUpdatedAt());

        return dto;
    }
}
