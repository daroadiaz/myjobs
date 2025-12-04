package com.myjobs.worker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerServiceDTO {
    private Long id;
    private Long workerId;
    private String workerName;
    private String title;
    private String description;
    private String category;
    private String location;
    private String status;
    private BigDecimal pricePerHour;
    private BigDecimal pricePerProject;
    private String pricingType;
    private String skills;
    private String experienceYears;
    private String portfolio;
    private String availability;
    private String contactEmail;
    private String contactPhone;
    private LocalDateTime createdAt;
    private Double averageRating;
    private Integer reviewCount;
}
