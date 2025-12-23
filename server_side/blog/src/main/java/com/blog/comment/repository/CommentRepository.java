package com.blog.comment.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.comment.model.Comment;

import jakarta.transaction.Transactional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
     List<Comment> findAllByPostIdOrderByCreatedAtDesc(Long postId);

     Page<Comment> findByPostId(Long postId, Pageable pageable);

     void deleteAllByUserId(Long userId);

     @Transactional
     void deleteAllByPostId(Long postId);

}
