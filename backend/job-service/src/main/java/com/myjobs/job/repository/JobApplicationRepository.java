package com.myjobs.job.repository;

import com.myjobs.job.entity.JobApplication;
import com.myjobs.job.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<JobApplication> findByJobOfferIdOrderByCreatedAtDesc(Long jobOfferId);

    @Query("SELECT a FROM JobApplication a JOIN a.jobOffer j WHERE j.employerId = :employerId ORDER BY a.createdAt DESC")
    List<JobApplication> findByEmployerIdOrderByCreatedAtDesc(@Param("employerId") Long employerId);

    Optional<JobApplication> findByJobOfferIdAndApplicantId(Long jobOfferId, Long applicantId);

    boolean existsByJobOfferIdAndApplicantId(Long jobOfferId, Long applicantId);

    List<JobApplication> findByJobOfferIdAndStatusOrderByCreatedAtDesc(Long jobOfferId, ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.jobOffer.id = :jobOfferId")
    Integer countByJobOfferId(@Param("jobOfferId") Long jobOfferId);
}
