package com.enterprise.app.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private Boolean success;
    private String message;
    private UserDTO user;

    public LoginResponse() {}

    public LoginResponse(Boolean success, String message, UserDTO user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }
}
