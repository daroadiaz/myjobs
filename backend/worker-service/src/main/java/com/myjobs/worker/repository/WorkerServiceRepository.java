package com.myjobs.worker.repository;

import com.myjobs.worker.entity.WorkerService;
import com.myjobs.worker.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerServiceRepository extends JpaRepository<WorkerService, Long> {

    List<WorkerService> findByWorkerIdOrderByCreatedAtDesc(Long workerId);

    List<WorkerService> findByStatusOrderByCreatedAtDesc(ServiceStatus status);

    @Query("SELECT s FROM WorkerService s WHERE s.status = :status AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.skills) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY s.createdAt DESC")
    List<WorkerService> searchActiveServices(@Param("query") String query, @Param("status") ServiceStatus status);

    List<WorkerService> findByCategoryAndStatusOrderByCreatedAtDesc(String category, ServiceStatus status);

    List<WorkerService> findByLocationContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(String location, ServiceStatus status);

    @Query("SELECT DISTINCT s.category FROM WorkerService s WHERE s.category IS NOT NULL")
    List<String> findAllCategories();
}
