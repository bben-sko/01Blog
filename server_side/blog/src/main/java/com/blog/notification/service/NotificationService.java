package com.blog.notification.service;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.notification.model.Notification;
import com.blog.notification.repository.NotificationRepository;
import com.blog.post.model.Post;
import com.blog.subscription.model.Subscription;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.user.model.User;

@Service
public class NotificationService {

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

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

 
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // public void markAllAsRead(Long userId) {
    //     List<Notification> unreadNotifications = getUnreadNotifications(userId);
    //     for (Notification notification : unreadNotifications) {
    //         notification.setRead(true);
    //         notificationRepository.save(notification);
    //     }
    // }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
