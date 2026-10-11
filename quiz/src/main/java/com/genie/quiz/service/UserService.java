package com.genie.quiz.service;

import com.genie.quiz.entity.User;
import com.genie.quiz.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String username, String rawPassword) {
        if (userRepo.existsByUsername(username)) {
            throw new IllegalStateException("Username already taken");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword)); // hash before saving
        user.setRole("USER"); // public registration always creates a regular user, never an admin
        return userRepo.save(user);
    }

    public User login(String username, String rawPassword) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        //returns true if the raw password, after encoding, matches the encoded password from storage
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return user;
    }
}