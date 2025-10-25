package com.blog.Likes.service;

import org.springframework.stereotype.Repository;

import com.blog.Likes.model.Like;
import com.blog.Likes.repository.LikeRepository;
import com.blog.post.model.Post;
import com.blog.user.model.User;

import jakarta.transaction.Transactional;

@Repository
public class LikeService {

      private final LikeRepository LikeRepository;

      LikeService(LikeRepository LikeRepository) {
        this.LikeRepository = LikeRepository;
      }

      @Transactional
        public void like(Long userId, Long postId) {
    if (LikeRepository.existsByUserIdAndPostId(userId, postId)) return;
    Post post = new Post(); post.setId(postId);
    User user = new User(); user.setId(userId);
    Like pl = new Like(); pl.setPost(post); pl.setUser(user);
    LikeRepository.save(pl);
  }

  @Transactional
  public void unlike(Long userId, Long postId) {
    LikeRepository.deleteByUserIdAndPostId(userId, postId);
  }


public boolean isLikedByUser(Long userId, Long postId) {
    return LikeRepository.existsByUserIdAndPostId(userId, postId);
  }
    
}
