package com.myjobs.worker.entity;

import com.myjobs.worker.enums.ServiceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker_services")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long workerId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceStatus status = ServiceStatus.ACTIVO;

    private BigDecimal pricePerHour;

    private BigDecimal pricePerProject;

    private String pricingType;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private String experienceYears;

    @Column(columnDefinition = "TEXT")
    private String portfolio;

    private String availability;

    private String contactEmail;

    private String contactPhone;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ServiceStatus.ACTIVO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
