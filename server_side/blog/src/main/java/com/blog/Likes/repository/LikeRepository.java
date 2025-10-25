package com.blog.Likes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.Likes.model.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    void deleteByUserIdAndPostId(Long userId, Long postId);
}
