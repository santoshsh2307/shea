package com.enterprise.app.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private String occupation;
    private String education;
    private String bloodGroup;
    private String membershipType;
    private Boolean isActive;
    private String password;
    private String photo;

}
