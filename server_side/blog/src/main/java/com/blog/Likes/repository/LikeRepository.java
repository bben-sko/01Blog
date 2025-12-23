package com.blog.Likes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.Likes.model.Like;

import jakarta.transaction.Transactional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserIdAndPostId(Long userId, Long postId);
   


    void deleteByUserIdAndPostId(Long userId, Long postId);

    @Transactional
    void deleteAllByPostId(Long PostId);
    
    @Transactional
    void deleteAllByUserId(Long userId);
}
