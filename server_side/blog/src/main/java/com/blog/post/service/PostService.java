
package com.blog.post.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blog.Likes.service.LikeService;
import com.blog.comment.dto.CommentDto;
import com.blog.comment.model.Comment;
import com.blog.comment.service.CommentService;
import com.blog.post.dto.PostResponseDto;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentService CommentService;

    @Autowired
    private LikeService LikeService;

    public Post createPost(String content, String[] media, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        Post post = new Post();
        post.setContent(content);
        post.setMedia(media);
        post.setUser(user);

        System.out.println(post);

        return postRepository.save(post);
    }

    public List<Post> GetPostsProfile(Long userId) {
        return postRepository.findByUserId(userId);
    }

   @Transactional
    public PostResponseDto GetSinglePosts(Long postId,Long userid) {

        // Use JOIN FETCH to eagerly load user
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Check if user liked the post
         
          boolean  likedByUser = LikeService.isLikedByUser(userid,postId);
        
        
        // Convert to DTO
        PostResponseDto dto = PostResponseDto.fromEntity(post, likedByUser, false);
        
        // Add comments
        List<Comment> comments = CommentService.getCommentPost(postId);

        dto.setComments(comments);
       
        
        return dto;
    }

    public List<Post> GetPostsHome(Long userId) {

        return postRepository.Homepage(userId);
    }

    public Post updatePost(Long postId, String newContent, String newMedia[]) {
        Post post = postRepository.findById(postId).orElseThrow();

        post.setContent(newContent);
        post.setMedia(newMedia);

        return postRepository.save(post);
    }

}
