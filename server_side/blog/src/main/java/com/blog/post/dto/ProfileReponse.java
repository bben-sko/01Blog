package com.blog.post.dto;

import java.util.List;

import com.blog.post.model.Post;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
public class ProfileReponse {
    List<Post> posts;
    String error;
}
