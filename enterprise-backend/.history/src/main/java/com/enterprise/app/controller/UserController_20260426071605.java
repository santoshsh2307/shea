package com.enterprise.app.controller;

import com.enterprise.app.dto.UserDTO;
import com.enterprise.app.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    // ========== GET ENDPOINTS ==========

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            log.error("Error fetching user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        try {
            UserDTO user = userService.getUserByUsername(username);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            log.error("Error fetching user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== POST ENDPOINT ==========

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "contactNumber", required = false) String contactNumber,
            @RequestParam(value = "occupation", required = false) String occupation,
            @RequestParam(value = "education", required = false) String education,
            @RequestParam(value = "bloodGroup", required = false) String bloodGroup,
            @RequestParam(value = "membershipType", required = false) String membershipType,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos) {
        try {
            log.info("Creating new user: {}", username);
            
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setPassword(password);
            userDTO.setEmail(email);
            userDTO.setFirstName(firstName);
            userDTO.setLastName(lastName);
            userDTO.setContactNumber(contactNumber);
            userDTO.setOccupation(occupation);
            userDTO.setEducation(education);
            userDTO.setBloodGroup(bloodGroup);
            userDTO.setMembershipType(membershipType);

            List<String> uploadedPhotoNames = new ArrayList<>();

            if (photo != null && !photo.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/photos");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(photo.getInputStream(), filePath);
                uploadedPhotoNames.add(fileName);
            }

            if (photos != null) {
                for (MultipartFile photoFile : photos) {
                    if (photoFile != null && !photoFile.isEmpty()) {
                        String fileName = UUID.randomUUID().toString() + "_" + photoFile.getOriginalFilename();
                        Path uploadPath = Paths.get("uploads/photos");
                        if (!Files.exists(uploadPath)) {
                            Files.createDirectories(uploadPath);
                        }
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(photoFile.getInputStream(), filePath);
                        uploadedPhotoNames.add(fileName);
                    }
                }
            }

            userDTO.setPhotos(uploadedPhotoNames);
            if (!uploadedPhotoNames.isEmpty()) {
                userDTO.setPhoto(uploadedPhotoNames.get(0));
            }

            UserDTO createdUser = userService.createUser(userDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("data", createdUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Validation error: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User creation failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping(value = "/{id}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadUserPhotos(
            @PathVariable Long id,
            @RequestParam("photos") List<MultipartFile> photos) {
        try {
            UserDTO existingUser = userService.getUserById(id);
            if (existingUser == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            List<String> uploadedPhotoNames = new ArrayList<>();
            Path uploadPath = Paths.get("uploads/photos");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile photo : photos) {
                if (photo != null && !photo.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(photo.getInputStream(), filePath);
                    uploadedPhotoNames.add(fileName);
                }
            }

            List<String> mergedPhotos = existingUser.getPhotos() != null ? new ArrayList<>(existingUser.getPhotos()) : new ArrayList<>();
            mergedPhotos.addAll(uploadedPhotoNames);
            existingUser.setPhotos(mergedPhotos);
            if (!mergedPhotos.isEmpty()) {
                existingUser.setPhoto(mergedPhotos.get(0));
            }

            userService.updateUser(id, existingUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Photos uploaded successfully");
            response.put("data", existingUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading photos: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Photo upload failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== PUT ENDPOINT ==========

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            log.info("Updating user with id: {}", id);
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("data", updatedUser);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("User not found: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User update failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== DELETE ENDPOINT ==========

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        try {
            log.info("Deleting user with id: {}", id);
            UserService userService = new UserService();
            UserDTO user = this.userService.getUserById(id);
            
            if (user == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            this.userService.deleteUser(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User deletion failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
