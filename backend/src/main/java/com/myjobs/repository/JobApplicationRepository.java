package com.myjobs.repository;

import com.myjobs.entity.JobApplication;
import com.myjobs.entity.JobOffer;
import com.myjobs.entity.User;
import com.myjobs.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByApplicant(User applicant);

    List<JobApplication> findByJobOffer(JobOffer jobOffer);

    List<JobApplication> findByStatus(ApplicationStatus status);

    @Query("SELECT a FROM JobApplication a WHERE a.jobOffer.employer.id = :employerId ORDER BY a.createdAt DESC")
    List<JobApplication> findApplicationsByEmployerId(Long employerId);

    @Query("SELECT a FROM JobApplication a WHERE a.applicant.id = :applicantId ORDER BY a.createdAt DESC")
    List<JobApplication> findByApplicantId(Long applicantId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.jobOffer.id = :jobOfferId")
    Long countByJobOfferId(Long jobOfferId);

    Optional<JobApplication> findByJobOfferAndApplicant(JobOffer jobOffer, User applicant);

    Boolean existsByJobOfferAndApplicant(JobOffer jobOffer, User applicant);
}
