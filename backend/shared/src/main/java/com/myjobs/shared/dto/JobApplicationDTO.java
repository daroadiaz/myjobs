package com.myjobs.shared.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationDTO {
    private Long id;

    @NotNull(message = "El ID de la oferta es requerido")
    private Long jobOfferId;

    private String jobOfferTitle;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;

    @NotBlank(message = "La carta de presentación es requerida")
    private String coverLetter;

    private String resumeUrl;
    private String status;
    private String employerComments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
