package com.blog.subscription.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.subscription.model.Subscription;
import com.blog.subscription.repository.SubscriptionRepository;
import com.blog.user.model.User;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Subscription createSubscription(User follower, User following) {
        
        Subscription subscription = new Subscription();
        subscription.setFollower(follower);
        subscription.setFollowing(following);
        return subscriptionRepository.save(subscription);
    }


    public void DeletSubscription(User follower, User following) {
            subscriptionRepository.deleteByFollowerIdAndFollowingId(follower.getId(), following.getId());
    }
}