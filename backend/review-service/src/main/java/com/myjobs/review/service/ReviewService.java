package com.myjobs.review.service;

import com.myjobs.review.dto.ReviewDTO;
import com.myjobs.review.dto.UserDTO;
import com.myjobs.review.entity.Review;
import com.myjobs.review.repository.ReviewRepository;
import com.myjobs.review.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate;

    @Value("${user.service.url:http://user-service:8082}")
    private String userServiceUrl;

    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByReviewedUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByReviewer(Long reviewerId) {
        return reviewRepository.findByReviewerIdOrderByCreatedAtDesc(reviewerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByJobOffer(Long jobOfferId) {
        return reviewRepository.findByRelatedJobOfferIdOrderByCreatedAtDesc(jobOfferId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByService(Long serviceId) {
        return reviewRepository.findByRelatedServiceIdOrderByCreatedAtDesc(serviceId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long userId) {
        Double average = reviewRepository.getAverageRatingByUserId(userId);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0;
    }

    public Integer getReviewCount(Long userId) {
        return reviewRepository.countByReviewedUserId(userId);
    }

    public ReviewDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        return convertToDTO(review);
    }

    @Transactional
    public ReviewDTO createReview(ReviewDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal.getId().equals(dto.getReviewedUserId())) {
            throw new RuntimeException("No puedes crear una reseña para ti mismo");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("La calificación debe estar entre 1 y 5");
        }

        Review review = Review.builder()
                .reviewerId(principal.getId())
                .reviewedUserId(dto.getReviewedUserId())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .reviewType(dto.getReviewType())
                .relatedJobOfferId(dto.getRelatedJobOfferId())
                .relatedServiceId(dto.getRelatedServiceId())
                .build();

        review = reviewRepository.save(review);
        return convertToDTO(review);
    }

    @Transactional
    public ReviewDTO updateReview(Long id, ReviewDTO dto) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        if (!review.getReviewerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para editar esta reseña");
        }

        if (dto.getRating() != null) {
            if (dto.getRating() < 1 || dto.getRating() > 5) {
                throw new RuntimeException("La calificación debe estar entre 1 y 5");
            }
            review.setRating(dto.getRating());
        }
        if (dto.getComment() != null) review.setComment(dto.getComment());

        review = reviewRepository.save(review);
        return convertToDTO(review);
    }

    @Transactional
    public void deleteReview(Long id) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        if (!review.getReviewerId().equals(principal.getId()) && !principal.getRole().equals("MODERADOR")) {
            throw new RuntimeException("No tienes permiso para eliminar esta reseña");
        }

        reviewRepository.delete(review);
    }

    private ReviewDTO convertToDTO(Review review) {
        String reviewerName = null;
        String reviewedUserName = null;

        try {
            UserDTO reviewer = restTemplate.getForObject(
                    userServiceUrl + "/users/" + review.getReviewerId(),
                    UserDTO.class
            );
            if (reviewer != null) {
                reviewerName = reviewer.getFirstName() + " " + reviewer.getLastName();
            }
        } catch (Exception e) {
            reviewerName = "Usuario #" + review.getReviewerId();
        }

        try {
            UserDTO reviewedUser = restTemplate.getForObject(
                    userServiceUrl + "/users/" + review.getReviewedUserId(),
                    UserDTO.class
            );
            if (reviewedUser != null) {
                reviewedUserName = reviewedUser.getFirstName() + " " + reviewedUser.getLastName();
            }
        } catch (Exception e) {
            reviewedUserName = "Usuario #" + review.getReviewedUserId();
        }

        return ReviewDTO.builder()
                .id(review.getId())
                .reviewerId(review.getReviewerId())
                .reviewerName(reviewerName)
                .reviewedUserId(review.getReviewedUserId())
                .reviewedUserName(reviewedUserName)
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewType(review.getReviewType())
                .relatedJobOfferId(review.getRelatedJobOfferId())
                .relatedServiceId(review.getRelatedServiceId())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
