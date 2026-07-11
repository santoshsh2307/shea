package com.enterprise.app.service;

import com.enterprise.app.dto.LoginRequest;
import com.enterprise.app.dto.UserDTO;
import com.enterprise.app.entity.User;
import com.enterprise.app.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ========== AUTHENTICATION ==========

    public UserDTO authenticate(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .map(this::convertToDTO)
                .orElse(null);
    }

    // ========== GET OPERATIONS ==========

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // ========== CREATE OPERATION ==========

    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setContactNumber(userDTO.getContactNumber());
        user.setOccupation(userDTO.getOccupation());
        user.setEducation(userDTO.getEducation());
        user.setBloodGroup(userDTO.getBloodGroup());
        user.setMembershipType(userDTO.getMembershipType());
        user.setPhoto(userDTO.getPhoto());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        log.info("User created: {}", savedUser.getUsername());
        return convertToDTO(savedUser);
    }

    // ========== UPDATE OPERATION ==========

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only provided fields
        if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getContactNumber() != null) user.setContactNumber(userDTO.getContactNumber());
        if (userDTO.getOccupation() != null) user.setOccupation(userDTO.getOccupation());
        if (userDTO.getEducation() != null) user.setEducation(userDTO.getEducation());
        if (userDTO.getBloodGroup() != null) user.setBloodGroup(userDTO.getBloodGroup());
        if (userDTO.getMembershipType() != null) user.setMembershipType(userDTO.getMembershipType());
        if (userDTO.getIsActive() != null) user.setIsActive(userDTO.getIsActive());

        User updatedUser = userRepository.save(user);
        log.info("User updated: {}", updatedUser.getUsername());
        return convertToDTO(updatedUser);
    }

    // ========== DELETE OPERATION ==========

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
        log.info("User deleted with id: {}", id);
    }

    // ========== HELPER METHOD ==========

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .contactNumber(user.getContactNumber())
                .occupation(user.getOccupation())
                .education(user.getEducation())
                .bloodGroup(user.getBloodGroup())
                .membershipType(user.getMembershipType())
                .isActive(user.getIsActive())
                .build();
    }
}
