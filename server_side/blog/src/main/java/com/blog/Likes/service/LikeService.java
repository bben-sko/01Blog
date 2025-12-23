package com.blog.Likes.service;

import org.springframework.stereotype.Repository;

import com.blog.Likes.model.Like;
import com.blog.Likes.repository.LikeRepository;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Repository
public class LikeService {

  private final LikeRepository LikeRepository;
  private final PostRepository PostRepository;
  private final UserRepository UserRepository;

  LikeService(LikeRepository LikeRepository, PostRepository PostRepository, UserRepository UserRepository) {
    this.UserRepository = UserRepository;
    this.PostRepository = PostRepository;
    this.LikeRepository = LikeRepository;
  }

  @Transactional
  public void like(Long userId, Long postId) {
    if (LikeRepository.existsByUserIdAndPostId(userId, postId))
      return;
    if (!PostRepository.existsById(postId))
      throw new RuntimeException("Post not found");
    if (!UserRepository.existsById(userId))
      throw new RuntimeException("User not found");

    Post post = PostRepository.findById(postId).get();
    if (!post.isEnabled()) {
      throw new RuntimeException("post not found");
    }
    
    
    User user = UserRepository.findById(userId).get();
    Like pl = new Like();
    pl.setPost(post);
    pl.setUser(user);
    LikeRepository.save(pl);
  }

  @Transactional
  public void unlike(Long userId, Long postId) {
    if (!PostRepository.existsById(postId))
      throw new RuntimeException("Post not found");
    if (!UserRepository.existsById(userId))
      throw new RuntimeException("User not found");
    Post post = PostRepository.findById(postId).get();
    if (!post.isEnabled()) {
      throw new RuntimeException("post not found");
    }
    LikeRepository.deleteByUserIdAndPostId(userId, postId);
  }

  public void deletePostLikes(Long postid) {
    LikeRepository.deleteAllByPostId(postid);
  }

  public boolean isLikedByUser(Long userId, Long postId) {
    return LikeRepository.existsByUserIdAndPostId(userId, postId);
  }

}
