package com.blog.post.repository;

import org.springframework.stereotype.Repository;

import com.blog.post.model.Post;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long Id);

    List<Post> findByUserIdOrderByCreatedAtDesc(Long Id);

    Optional<Post> findByIdAndUserId(Long id, Long Id);

    boolean existsByIdAndUserId(Long id, Long Id);

    void deleteByUserId(Long Id);

}