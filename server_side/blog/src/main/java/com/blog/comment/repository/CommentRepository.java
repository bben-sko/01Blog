package com.blog.comment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.blog.comment.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
     List<Comment> findAllByPostIdOrderByCreatedAtDesc(Long postId);
     void deleteByPostId(Long postId);

}