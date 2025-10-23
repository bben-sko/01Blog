
package com.blog.post.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class PostService {
 
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Post createPost(String content, String[] media, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        Post post = new Post();
        post.setContent(content);      
        post.setMedia(media);          
        post.setUser(user);            
        
        System.out.println(post);
     
        return postRepository.save(post);
    }

    public List<Post> GetPostsProfile(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> GetPostsHome(Long userId) {
        return postRepository.Homepage(userId);
    }
    
    public Post updatePost(Long postId, String newContent, String newMedia[]) {
        Post post = postRepository.findById(postId).orElseThrow();
        
        post.setContent(newContent);   
        post.setMedia(newMedia); 
        
        return postRepository.save(post);
    }

}
