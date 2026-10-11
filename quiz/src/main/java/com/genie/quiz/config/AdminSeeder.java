package com.genie.quiz.config;

import com.genie.quiz.entity.User;
import com.genie.quiz.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.existsByUsername("admin")) {
            return; // already seeded, do nothing
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123")); // change this after first login in a real deployment
        admin.setRole("ADMIN");
        userRepo.save(admin);

        System.out.println("Seeded default admin user -> username: admin / password: admin123");
    }
}