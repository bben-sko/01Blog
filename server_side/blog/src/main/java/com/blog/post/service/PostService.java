
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
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.blog.Likes.service.LikeService;

import com.blog.common.util.StorageService;
import com.blog.common.exception.ResourceNotFoundException;
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
    public Post createPost(String title, String content, List<MultipartFile> files, User user) throws IOException {
        Post post = new Post();
        post.setContent(content);
        post.setTitle(title);
        post.setUser(user);
        List<String> urls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile f : files) {
                urls.add(storageService.saveAndReturnUrl(f));
            }
        }
        post.setMedia(urls);
        Post saved = postRepository.save(post);
        return saved;
    }

    public List<Post> GetPostsProfile(Long userId, int page, int size) {
        return postRepository.findByUserIdAndEnabledTrueOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
                .getContent();
    }

    @Transactional
    public PostResponseDto GetSinglePosts(Long postId, Long userid) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        boolean likedByUser = LikeService.isLikedByUser(userid, postId);
        PostResponseDto dto = PostResponseDto.fromEntity(post, likedByUser, post.getUser().getId().equals(userid));

        return dto;
    }

    public List<Post> GetPostsHome(Long userId, int page, int size) {

        return postRepository.Homepage(userId, PageRequest.of(page, size)).getContent();
    }

    public PostResponseDto updatePost(Long postId, String newContent, List<MultipartFile> newFiles,
            List<String> existingMedia, User user) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!post.isEnabled()) {
            throw new ResourceNotFoundException("Post is hidde");
        } else if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        post.setContent(newContent);

        List<String> updatedMedia = new ArrayList<>();

        if (existingMedia != null && !existingMedia.isEmpty()) {
            updatedMedia.addAll(existingMedia);
        } else if ((newFiles == null || newFiles.isEmpty()) && post.getMedia() != null) {
            updatedMedia.addAll(post.getMedia());
        }

        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                updatedMedia.add(storageService.saveAndReturnUrl(file));
            }
        }

        post.setMedia(updatedMedia);
        Post saved = postRepository.save(post);

        boolean liked = LikeService.isLikedByUser(user.getId(), saved.getId());
        return PostResponseDto.fromEntity(saved, liked, true);
    }

    public void DeletePost(Long postId) {
        LikeService.deletePostLikes(postId);
        postRepository.deleteById(postId);

    }


}
