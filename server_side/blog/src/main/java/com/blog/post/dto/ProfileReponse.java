package com.blog.post.dto;

import java.util.List;

import com.blog.post.model.Post;
import com.blog.user.model.User;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
public class ProfileReponse {
    User user;
    List<Post> posts;
    String error;
}
