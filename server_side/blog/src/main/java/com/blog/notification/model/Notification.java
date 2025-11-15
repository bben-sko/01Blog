package com.blog.notification.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import com.blog.user.model.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private Long postId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private boolean isRead = false;

    @CreatedDate
    private LocalDateTime createdAt;

}