package com.enterprise.app.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private Boolean success;
    private String message;
    private UserDTO user;
}
