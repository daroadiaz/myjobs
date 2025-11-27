package com.myjobs.repository;

import com.myjobs.entity.User;
import com.myjobs.entity.WorkerService;
import com.myjobs.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerServiceRepository extends JpaRepository<WorkerService, Long> {

    List<WorkerService> findByWorker(User worker);

    List<WorkerService> findByStatus(ServiceStatus status);

    List<WorkerService> findByCategory(String category);

    @Query("SELECT w FROM WorkerService w WHERE w.status = 'APROBADO' ORDER BY w.createdAt DESC")
    List<WorkerService> findApprovedServices();

    @Query("SELECT w FROM WorkerService w WHERE w.status = 'PENDIENTE' ORDER BY w.createdAt ASC")
    List<WorkerService> findPendingServices();

    @Query("SELECT w FROM WorkerService w WHERE w.worker.id = :workerId ORDER BY w.createdAt DESC")
    List<WorkerService> findByWorkerId(Long workerId);

    @Query("SELECT w FROM WorkerService w WHERE w.status = 'APROBADO' AND " +
           "(LOWER(w.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(w.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(w.category) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY w.createdAt DESC")
    List<WorkerService> searchApprovedServices(String search);

    @Query("SELECT COUNT(w) FROM WorkerService w WHERE w.worker.id = :workerId")
    Long countByWorkerId(Long workerId);
}
