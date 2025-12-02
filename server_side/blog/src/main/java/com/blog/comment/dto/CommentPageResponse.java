package com.blog.comment.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentPageResponse {
    private List<CommentDto> comments;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
