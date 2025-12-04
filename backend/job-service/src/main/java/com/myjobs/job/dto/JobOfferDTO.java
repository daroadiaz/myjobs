package com.myjobs.job.dto;

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
public class JobOfferDTO {
    private Long id;
    private Long employerId;
    private String employerName;
    private String title;
    private String description;
    private String category;
    private String location;
    private String status;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryPeriod;
    private String workType;
    private String experienceLevel;
    private String requirements;
    private String benefits;
    private String contactEmail;
    private String contactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Integer applicationCount;
}
