package com.blog.subscription.repository;

import java.util.List;
import com.blog.subscription.model.Subscription;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    List<Long> findFollowingIdsByFollowerId(Long followerId);
    List<Long> findFollowerIdsByFollowingId(Long followingId);
    List<Subscription> findByFollowerId(Long followerId);
    List<Subscription> findByFollowingId(Long followingId);
    @Transactional
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

    @Transactional
    void deleteAllByFollowerId(Long followerId);

    @Transactional
    void deleteAllByFollowingId(Long followingId);
    
}