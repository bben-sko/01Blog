package com.blog.post.repository;

import org.springframework.stereotype.Repository;

import com.blog.post.model.Post;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {


    List<Post> findByUserId(Long userId);
    
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Post> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByIdAndUserId(Long id, Long userId);
    
    void deleteByUserId(Long userId);
    
}