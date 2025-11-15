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

    // Create notifications for all subscribers when new blog is posted
    public void notifySubscribers(Post post, User author) {
        // Get all users who are subscribed to this author
        List<Subscription> subscribers = subscriptionRepository.findByFollowingId(author.getId());

        for (Subscription subscriber : subscribers) {
            Notification notification = new Notification();
            notification.setMessage(author.getName() + " posted a new blog ");
            notification.setPostId(post.getId());
            notification.setUser(subscriber.getFollowing());
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    // Get all notifications for a user
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get only unread notifications
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // Get notifications after a certain time (for polling)
    public List<Notification> getNotificationsAfter(Long userId, LocalDateTime after) {
        return notificationRepository.findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(userId, after);
    }

    // Mark notification as read
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Security check: ensure notification belongs to the user
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    // Get unread count
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
