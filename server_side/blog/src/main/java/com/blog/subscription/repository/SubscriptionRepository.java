package com.blog.subscription.repository;

import java.util.List;
import com.blog.subscription.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    List<Long> findFollowingIdsByFollowerId(Long followerId);
    List<Long> findFollowerIdsByFollowingId(Long followingId);
    void deleteByfollowerIdAndFollowingId(Long followerId, Long followingId);
     
}