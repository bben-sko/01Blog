package com.blog.comment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.blog.comment.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
    @Query("SELECT * FROM comments c WHERE c.post_id = :postId")
    List<Comment> findAllByPostId(@Param("postId") Long postId);
}