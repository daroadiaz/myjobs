package com.myjobs.dto;

import com.myjobs.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private String profileImage;
    private String bio;
    private String location;
    private Boolean active;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private Double averageRating;
    private Long totalReviews;
}
