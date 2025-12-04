package com.myjobs.review.repository;

import com.myjobs.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewedUserIdOrderByCreatedAtDesc(Long reviewedUserId);

    List<Review> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId);

    List<Review> findByRelatedJobOfferIdOrderByCreatedAtDesc(Long jobOfferId);

    List<Review> findByRelatedServiceIdOrderByCreatedAtDesc(Long serviceId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewedUserId = :userId")
    Double getAverageRatingByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewedUserId = :userId")
    Integer countByReviewedUserId(@Param("userId") Long userId);

    Optional<Review> findByReviewerIdAndReviewedUserIdAndRelatedJobOfferId(
            Long reviewerId, Long reviewedUserId, Long relatedJobOfferId);

    Optional<Review> findByReviewerIdAndReviewedUserIdAndRelatedServiceId(
            Long reviewerId, Long reviewedUserId, Long relatedServiceId);

    boolean existsByReviewerIdAndReviewedUserId(Long reviewerId, Long reviewedUserId);
}
