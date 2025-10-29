package com.blog.post.dto;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import com.blog.comment.model.Comment;
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
    private Long userId;
    private boolean enable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Comment> comments ;
    private boolean likedByUser;
    private boolean ismy;


      public static PostResponseDto fromEntity(Post post, boolean likedByUser, boolean ismy) {
        PostResponseDto dto = new PostResponseDto();
        dto.setPostId(post.getId());
        dto.setContent(post.getContent());
        dto.setMedia(post.getMedia() != null ? post.getMedia() : List.of());
        dto.setUsername(post.getUser().getUsername());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setLikedByUser(likedByUser);
        dto.setIsmy(ismy);
        return dto;
    }
}