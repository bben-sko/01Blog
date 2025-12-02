package com.blog.admin.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.blog.post.dto.PostResponseDto;
import com.blog.post.model.Post;
import com.blog.post.repository.PostRepository;
import com.blog.report.dto.ReportDTO;
import com.blog.report.model.Report;
import com.blog.report.model.ReportStatus;
import com.blog.report.repository.ReportRepository;
import com.blog.user.dto.UserDTO;
import com.blog.user.model.User;
import com.blog.user.repository.UserRepository;

@Service
public class AdminReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PostRepository postRepository;
    
     public void resolveReport(Long reportId, String adminNote, Long adminId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());
        report.setAdminNote(adminNote);
        report.setResolvedBy(userRepository.findById(adminId).orElse(null));
        reportRepository.save(report);
    }
    
    public List<UserDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).stream()
            .map(this::convertToUserDTO)
            .collect(Collectors.toList());
    }
    
    public List<PostResponseDto> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAll(pageable).stream()
            .map(this::convertToPostDTO)
            .collect(Collectors.toList());
    }
    
    private ReportDTO convertToReportDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setPostId(report.getPost().getId());
        dto.setPostContent(report.getPost().getContent());
        dto.setReporterId(report.getReporter().getId());
        dto.setReporterUsername(report.getReporter().getUsername());
        dto.setPostEnabled(report.getPost().isEnabled());
        dto.setReason(report.getReason());
        dto.setDescription(report.getReason());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setResolvedAt(report.getResolvedAt());
        dto.setAdminNote(report.getAdminNote());
        dto.setResolvedBy(report.getResolvedBy() != null ? report.getResolvedBy().getUsername() : null);
        return dto;
    }
    
    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        dto.setEnable(user.isEnabled());
        return dto;
    }
    
    private PostResponseDto convertToPostDTO(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setPostId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUsername(post.getUser().getUsername());
        dto.setContent(post.getContent());
        // dto.setImageUrl(post.getImageUrl());
        dto.setEnable(post.isEnabled());
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }
    
}
