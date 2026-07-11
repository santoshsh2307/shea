package com.enterprise.app.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private Boolean success;
    private String message;
    private UserDTO user;

    // Getters and Setters
    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
