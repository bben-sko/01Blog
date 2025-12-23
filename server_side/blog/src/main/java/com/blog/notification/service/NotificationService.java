package com.blog.notification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blog.notification.model.Notification;
import com.blog.notification.repository.NotificationRepository;
import com.blog.post.model.Post;
import com.blog.subscription.model.Subscription;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.user.model.User;

@Service
public class NotificationService {

    private static final int MAX_PAGE_SIZE = 50;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public void notifySubscribers(Post post, User author) {
        List<Subscription> subscribers = subscriptionRepository.findByFollowingId(author.getId());

        for (Subscription subscription : subscribers) {
            User follower = subscription.getFollower();
            if (follower == null || !follower.isEnabled() || follower.getId().equals(author.getId())) {
                continue;
            }

            Notification notification = new Notification();
            notification.setMessage(author.getName() + " posted a new blog");
            notification.setPostId(post.getId());
            notification.setUser(follower);
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    public Page<Notification> getUserNotifications(Long userId, int page, int size) {
        Pageable pageable = buildPageable(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Page<Notification> getUnreadNotifications(Long userId, int page, int size) {
        Pageable pageable = buildPageable(page, size);
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable);
    }

    private Pageable buildPageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        return PageRequest.of(safePage, safeSize);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        System.out.println("Marking notification " + notificationId + " as read for user " + userId);
        notification.setRead(true);
        notificationRepository.save(notification);
    }    

    public boolean getUnreadCount(Long userId) {
        return notificationRepository.existsByUserIdAndIsReadFalse(userId);
    }
}
