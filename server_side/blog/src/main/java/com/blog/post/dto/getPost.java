package com.blog.post.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class getPost {
    private Long postId;
    private String content;
    private String[] media;
    private String username;
    private String createdAt;
    private String updatedAt;
    private boolean likedByUser;
}