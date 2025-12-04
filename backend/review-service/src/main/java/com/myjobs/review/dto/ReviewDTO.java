package com.myjobs.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long reviewedUserId;
    private String reviewedUserName;
    private Integer rating;
    private String comment;
    private String reviewType;
    private Long relatedJobOfferId;
    private Long relatedServiceId;
    private LocalDateTime createdAt;
}
