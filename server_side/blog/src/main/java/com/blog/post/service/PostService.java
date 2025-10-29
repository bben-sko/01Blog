
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
import com.blog.post.dto.CreatePostRequest;
import com.blog.post.dto.PostResponseDto;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;

import com.blog.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;



    @Autowired
    private LikeService LikeService;

    // public Post createPost(String content, String[] media, Long userId) {
    // User user = userRepository.findById(userId).orElseThrow();

    // Post post = new Post();
    // post.setContent(content);
    // post.setMedia(media);
    // post.setUser(user);

    // System.out.println(post);

    // return postRepository.save(post);
    // }

    @Transactional
    public CreatePostRequest createPost(String content, List<MultipartFile> files, Long userId) throws IOException {
        Post post = new Post();
        post.setContent(content);
        // post.setUserId(userId);

        List<String> urls = new ArrayList<>();
        if (files != null) {
            Files.createDirectories(Path.of("uploads"));
            for (MultipartFile f : files) {
                if (f.isEmpty())
                    continue;
                String name = Optional.ofNullable(f.getOriginalFilename()).orElse("media");
                String ext = name.contains(".") ? name.substring(name.lastIndexOf('.')) : "";
                String fileName = UUID.randomUUID() + ext;
                Path target = Path.of("uploads").resolve(fileName);
                String ct = Optional.ofNullable(f.getContentType()).orElse("");
                if (!(ct.startsWith("image/") || ct.startsWith("video/")))
                    continue;
                Files.copy(f.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                urls.add("/media/" + fileName);
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

        // Use JOIN FETCH to eagerly load user
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if user liked the post

        boolean likedByUser = LikeService.isLikedByUser(userid, postId);

        // Convert to DTO
        PostResponseDto dto = PostResponseDto.fromEntity(post, likedByUser, false);

        // Add comments
        // List<Comment> comments = CommentService.getCommentPost(postId);

        // dto.setComments(comments);

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

}
