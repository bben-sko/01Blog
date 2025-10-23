package com.blog.post.repository;

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

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
        List<Post> Homepage(@Param("userId") Long username);

    List<Post> findByUserIdOrderByCreatedAtDesc(Long Id);

    Optional<Post> findByIdAndUserId(Long id, Long Id);

    boolean existsByIdAndUserId(Long id, Long Id);

    void deleteByUserId(Long Id);

}