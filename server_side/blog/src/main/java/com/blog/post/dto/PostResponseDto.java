package com.blog.post.dto;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import com.blog.post.model.Post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDto {
    private Long postId;
    private String content;
    private List<String> media;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean likedByUser;


      public static PostResponseDto fromEntity(Post post, boolean likedByUser) {
        PostResponseDto dto = new PostResponseDto();
        dto.setPostId(post.getId());
        dto.setContent(post.getContent());
        dto.setMedia(post.getMedia() != null ? Arrays.asList(post.getMedia()) : List.of());
        dto.setUsername(post.getUser().getUsername());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikedByUser(likedByUser);
        return dto;
    }
}