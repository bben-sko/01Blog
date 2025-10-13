package com.blog.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    @Size(max = 10000, message = "max 10.000 caracter")
    @NotBlank(message = "required content")
    private String content;

    private String[] media;
}