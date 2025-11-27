package com.myjobs.dto;

import com.myjobs.enums.ServiceStatus;
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
public class WorkerServiceDTO {

    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    private String location;
    private BigDecimal priceMin;
    private BigDecimal priceMax;
    private String pricePeriod;
    private String skills;
    private String portfolio;
    private String experienceYears;
    private String availability;
    private ServiceStatus status;
    private Integer views;
    private Long workerId;
    private String workerName;
    private String workerEmail;
    private Long moderatorId;
    private String moderatorComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
