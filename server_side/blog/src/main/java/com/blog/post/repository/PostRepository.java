package com.blog.post.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.blog.post.model.Post;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long Id);
    Page<Post> findByUserIdAndEnabledTrueOrderByCreatedAtDesc(Long Id, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId OR p.user.id IN (SELECT s.following.id FROM Subscription s WHERE s.follower.id = :userId) ORDER BY p.createdAt DESC")
        Page<Post> Homepage(@Param("userId") Long username, Pageable pageable);

    Optional<Post> findByIdAndUserId(Long id, Long Id);
    
    
    Optional<Post> findPostById(Long postId);

    boolean existsByIdAndUserId(Long id, Long Id);

    void deleteByUserId(Long Id);


    long countByEnabled(boolean status);

    List<Post> findByEnabledOrderByCreatedAtDesc(boolean status);

}
