package com.enterprise.app.controller;

import com.enterprise.app.dto.LoginRequest;
import com.enterprise.app.dto.LoginResponse;
import com.enterprise.app.dto.UserDTO;
import com.enterprise.app.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            log.info("Login attempt for user: {}", request.getUsername());
            UserDTO user = userService.authenticate(request);

            if (user != null) {
                LoginResponse response = new LoginResponse(true, "Login Successful", user);
                return ResponseEntity.ok(response);
            } else {
                LoginResponse response = new LoginResponse(false, "Invalid Credentials", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            LoginResponse response = new LoginResponse(false, "Login Failed", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
