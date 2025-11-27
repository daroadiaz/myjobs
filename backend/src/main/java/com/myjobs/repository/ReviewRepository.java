package com.myjobs.repository;

import com.myjobs.entity.Review;
import com.myjobs.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUser(User user);

    List<Review> findByReviewer(User reviewer);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Review> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.user.id = :userId")
    Double getAverageRatingByUserId(Long userId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.user.id = :userId")
    Long countByUserId(Long userId);
}
