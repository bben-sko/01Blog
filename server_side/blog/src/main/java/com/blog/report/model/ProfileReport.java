package com.blog.report.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.blog.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "profile_reports", uniqueConstraints = { 
        @UniqueConstraint(columnNames = {"reporter_id", "reported_user_id"})
}) 
@Data

public class ProfileReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;

    @Column(nullable = false, length = 1000)
    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    @Size(min = 10, message = "Reason must be at least 10 characters long")
    private String reason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
