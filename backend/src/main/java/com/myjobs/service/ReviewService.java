package com.myjobs.service;

import com.myjobs.dto.ReviewDTO;
import com.myjobs.entity.Review;
import com.myjobs.entity.User;
import com.myjobs.exception.BadRequestException;
import com.myjobs.exception.ResourceNotFoundException;
import com.myjobs.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;

    @Transactional
    public ReviewDTO createReview(ReviewDTO dto) {
        User currentUser = userService.getCurrentUser();
        User reviewedUser = userService.getUserById(dto.getUserId());

        if (currentUser.getId().equals(reviewedUser.getId())) {
            throw new BadRequestException("No puedes dejarte una reseña a ti mismo");
        }

        Review review = new Review();
        review.setUser(reviewedUser);
        review.setReviewer(currentUser);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCategory(dto.getCategory());

        Review savedReview = reviewRepository.save(review);
        return convertToDTO(savedReview);
    }

    public ReviewDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña", "id", id));
        return convertToDTO(review);
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageRatingByUserId(Long userId) {
        Double avg = reviewRepository.getAverageRatingByUserId(userId);
        return avg != null ? avg : 0.0;
    }

    @Transactional
    public ReviewDTO updateReview(Long id, ReviewDTO dto) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!review.getReviewer().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Solo puedes actualizar tus propias reseñas");
        }

        if (dto.getRating() != null) review.setRating(dto.getRating());
        if (dto.getComment() != null) review.setComment(dto.getComment());

        Review updatedReview = reviewRepository.save(review);
        return convertToDTO(updatedReview);
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña", "id", id));

        User currentUser = userService.getCurrentUser();
        if (!review.getReviewer().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Solo puedes eliminar tus propias reseñas");
        }

        reviewRepository.delete(review);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setReviewerName(review.getReviewer().getFirstName() + " " + review.getReviewer().getLastName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCategory(review.getCategory());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        return dto;
    }
}
