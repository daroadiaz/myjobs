package com.myjobs.job.repository;

import com.myjobs.job.entity.JobOffer;
import com.myjobs.job.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    List<JobOffer> findByEmployerIdOrderByCreatedAtDesc(Long employerId);

    List<JobOffer> findByStatusOrderByCreatedAtDesc(JobStatus status);

    @Query("SELECT j FROM JobOffer j WHERE j.status = :status AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY j.createdAt DESC")
    List<JobOffer> searchActiveJobOffers(@Param("query") String query, @Param("status") JobStatus status);

    List<JobOffer> findByCategoryAndStatusOrderByCreatedAtDesc(String category, JobStatus status);

    List<JobOffer> findByLocationContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(String location, JobStatus status);

    @Query("SELECT DISTINCT j.category FROM JobOffer j WHERE j.category IS NOT NULL")
    List<String> findAllCategories();
}
