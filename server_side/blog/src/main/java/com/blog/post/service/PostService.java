
package com.blog.post.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;

import java.util.List;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.blog.Likes.service.LikeService;

import com.blog.comment.service.CommentService;
import com.blog.common.util.StorageService;
import com.blog.post.dto.CreatePostRequest;
import com.blog.post.dto.PostResponseDto;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.user.model.User;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeService LikeService;

    @Autowired
    private StorageService storageService;

    public Post getPostById(Long postId) {

        return postRepository.findById(postId).orElse(null);
    }

    @Transactional
    public CreatePostRequest createPost(String content, List<MultipartFile> files, User user) throws IOException {
        Post post = new Post();
        post.setContent(content);
        post.setUser(user);
        List<String> urls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile f : files) {
                urls.add(storageService.saveAndReturnUrl(f));
            }
        }
        post.setMedia(urls);
        Post saved = postRepository.save(post);
        return new CreatePostRequest(saved.getContent(), saved.getMedia());
    }

    public List<Post> GetPostsProfile(Long userId) {
        return postRepository.findByUserId(userId);
    }

   
    @Transactional
    public PostResponseDto GetSinglePosts(Long postId, Long userid) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        boolean likedByUser = LikeService.isLikedByUser(userid, postId);
        PostResponseDto dto = PostResponseDto.fromEntity(post, likedByUser, post.getUser().getId().equals(userid));

        return dto;
    }

    public List<Post> GetPostsHome(Long userId) {

        return postRepository.Homepage(userId);
    }

    public Post updatePost(Long postId, String newContent, String newMedia[]) {
        Post post = postRepository.findById(postId).orElseThrow();

        post.setContent(newContent);
        // post.setMedia(newMedia);

        return postRepository.save(post);
    }

    public void DeletePost(Long postId) {
        LikeService.deletePostLikes(postId);
        postRepository.deleteById(postId);
    }

}
