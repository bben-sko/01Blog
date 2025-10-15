package com.blog.post.model;


import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.blog.user.model.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "posts")
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
     
    private String[] media;
    
    @Column(nullable = false)
    private String content;

    private boolean enabled = true;
    
    @CreationTimestamp 
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt ;

   
}   
