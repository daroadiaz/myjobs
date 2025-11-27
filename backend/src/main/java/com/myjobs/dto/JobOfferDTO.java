package com.myjobs.dto;

import com.myjobs.enums.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOfferDTO {

    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryPeriod;
    private String jobType;
    private String requirements;
    private String benefits;
    private JobStatus status;
    private LocalDateTime expiresAt;
    private Integer views;
    private Long employerId;
    private String employerName;
    private String employerEmail;
    private Long moderatorId;
    private String moderatorComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long applicationCount;
}
