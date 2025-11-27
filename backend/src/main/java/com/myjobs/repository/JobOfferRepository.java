package com.myjobs.repository;

import com.myjobs.entity.JobOffer;
import com.myjobs.entity.User;
import com.myjobs.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    List<JobOffer> findByEmployer(User employer);

    List<JobOffer> findByStatus(JobStatus status);

    List<JobOffer> findByCategory(String category);

    @Query("SELECT j FROM JobOffer j WHERE j.status = 'APROBADO' ORDER BY j.createdAt DESC")
    List<JobOffer> findApprovedJobOffers();

    @Query("SELECT j FROM JobOffer j WHERE j.status = 'PENDIENTE' ORDER BY j.createdAt ASC")
    List<JobOffer> findPendingJobOffers();

    @Query("SELECT j FROM JobOffer j WHERE j.employer.id = :employerId ORDER BY j.createdAt DESC")
    List<JobOffer> findByEmployerId(Long employerId);

    @Query("SELECT j FROM JobOffer j WHERE j.status = 'APROBADO' AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(j.category) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY j.createdAt DESC")
    List<JobOffer> searchApprovedJobs(String search);

    @Query("SELECT COUNT(j) FROM JobOffer j WHERE j.employer.id = :employerId")
    Long countByEmployerId(Long employerId);
}
