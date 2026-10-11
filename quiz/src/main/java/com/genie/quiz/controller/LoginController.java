package com.genie.quiz.controller;

import com.genie.quiz.security.JwtUtil;
import com.genie.quiz.dto.LoginRequest;
import com.genie.quiz.dto.RegisterRequest;
import com.genie.quiz.entity.QuizQuestion;
import com.genie.quiz.entity.User;
import com.genie.quiz.service.QuestionService;
import com.genie.quiz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    QuestionService questionService;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.register(registerRequest.getUsername(), registerRequest.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Registration successful", "username", user.getUsername()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "token", token
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/questions")
    public List<QuizQuestion> getQuestions() {
        return questionService.getAllQuestions();
    }

    @PostMapping(value = "/save", consumes = "application/json", produces = "application/json")
    public QuizQuestion saveQuestion(@RequestBody QuizQuestion question) {
        return questionService.saveQuestion(question);
    }
}