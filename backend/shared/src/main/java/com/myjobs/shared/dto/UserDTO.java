package com.myjobs.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String role;
    private String profileImage;
    private String bio;
    private String location;
    private boolean active;
    private boolean emailVerified;
    private LocalDateTime createdAt;
    private Double averageRating;
    private Integer totalReviews;
}
