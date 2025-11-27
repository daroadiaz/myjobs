package com.myjobs.dto;

import com.myjobs.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationDTO {

    private Long id;

    @NotNull(message = "El ID de la oferta laboral es obligatorio")
    private Long jobOfferId;

    private String jobOfferTitle;

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;

    @NotBlank(message = "La carta de presentación es obligatoria")
    private String coverLetter;

    private String resumeUrl;
    private ApplicationStatus status;
    private String employerComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
