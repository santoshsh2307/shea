package com.enterprise.app.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "marital_status", length = 20)
    private String maritalStatus;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "alternate_contact", length = 20)
    private String alternateContact;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "education", length = 100)
    private String education;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "height", length = 10)
    private String height;

    @Column(name = "weight", length = 10)
    private String weight;

    @Column(name = "religion", length = 50)
    private String religion;

    @Column(name = "caste", length = 50)
    private String caste;

    @Column(name = "sub_caste", length = 50)
    private String subCaste;

    @Lob
    @Column(name = "current_address", columnDefinition = "TEXT")
    private String currentAddress;

    @Lob
    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "father_occupation", length = 100)
    private String fatherOccupation;

    @Column(name = "mother_name", length = 100)
    private String motherName;

    @Column(name = "mother_occupation", length = 100)
    private String motherOccupation;

    @Column(name = "siblings", length = 100)
    private String siblings;

    @Column(name = "family_income", length = 50)
    private String familyIncome;

    @Column(name = "job_type", length = 50)
    private String jobType;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "annual_income", length = 50)
    private String annualIncome;

    @Lob
    @Column(name = "hobbies", columnDefinition = "TEXT")
    private String hobbies;

    @Lob
    @Column(name = "interests", columnDefinition = "TEXT")
    private String interests;

    @Column(name = "membership_type", length = 50)
    private String membershipType;

    @Lob
    @Column(name = "photo", columnDefinition = "TEXT")
    private String photo;

    @Lob
    @Column(name = "photos", columnDefinition = "TEXT")
    private String photos;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    
}