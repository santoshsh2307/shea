package com.enterprise.app.service;

import com.enterprise.app.dto.LoginRequest;
import com.enterprise.app.dto.UserDTO;
import com.enterprise.app.entity.User;
import com.enterprise.app.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

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
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setGender(userDTO.getGender());
        user.setMaritalStatus(userDTO.getMaritalStatus());
        user.setContactNumber(userDTO.getContactNumber());
        user.setAlternateContact(userDTO.getAlternateContact());
        user.setOccupation(userDTO.getOccupation());
        user.setEducation(userDTO.getEducation());
        user.setBloodGroup(userDTO.getBloodGroup());
        user.setHeight(userDTO.getHeight());
        user.setWeight(userDTO.getWeight());
        user.setReligion(userDTO.getReligion());
        user.setCaste(userDTO.getCaste());
        user.setSubCaste(userDTO.getSubCaste());
        user.setCurrentAddress(userDTO.getCurrentAddress());
        user.setPermanentAddress(userDTO.getPermanentAddress());
        user.setFatherName(userDTO.getFatherName());
        user.setFatherOccupation(userDTO.getFatherOccupation());
        user.setMotherName(userDTO.getMotherName());
        user.setMotherOccupation(userDTO.getMotherOccupation());
        user.setSiblings(userDTO.getSiblings());
        user.setFamilyIncome(userDTO.getFamilyIncome());
        user.setJobType(userDTO.getJobType());
        user.setCompanyName(userDTO.getCompanyName());
        user.setAnnualIncome(userDTO.getAnnualIncome());
        user.setHobbies(userDTO.getHobbies());
        user.setInterests(userDTO.getInterests());
        user.setMembershipType(userDTO.getMembershipType());
        user.setPhoto(userDTO.getPhoto());
        user.setPhotos(serializePhotos(userDTO.getPhotos()));
        if (userDTO.getPhotos() != null && !userDTO.getPhotos().isEmpty()) {
            user.setPhoto(userDTO.getPhotos().get(0));
        }
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
        if (userDTO.getDateOfBirth() != null) user.setDateOfBirth(userDTO.getDateOfBirth());
        if (userDTO.getGender() != null) user.setGender(userDTO.getGender());
        if (userDTO.getMaritalStatus() != null) user.setMaritalStatus(userDTO.getMaritalStatus());
        if (userDTO.getContactNumber() != null) user.setContactNumber(userDTO.getContactNumber());
        if (userDTO.getAlternateContact() != null) user.setAlternateContact(userDTO.getAlternateContact());
        if (userDTO.getOccupation() != null) user.setOccupation(userDTO.getOccupation());
        if (userDTO.getEducation() != null) user.setEducation(userDTO.getEducation());
        if (userDTO.getBloodGroup() != null) user.setBloodGroup(userDTO.getBloodGroup());
        if (userDTO.getHeight() != null) user.setHeight(userDTO.getHeight());
        if (userDTO.getWeight() != null) user.setWeight(userDTO.getWeight());
        if (userDTO.getReligion() != null) user.setReligion(userDTO.getReligion());
        if (userDTO.getCaste() != null) user.setCaste(userDTO.getCaste());
        if (userDTO.getSubCaste() != null) user.setSubCaste(userDTO.getSubCaste());
        if (userDTO.getCurrentAddress() != null) user.setCurrentAddress(userDTO.getCurrentAddress());
        if (userDTO.getPermanentAddress() != null) user.setPermanentAddress(userDTO.getPermanentAddress());
        if (userDTO.getFatherName() != null) user.setFatherName(userDTO.getFatherName());
        if (userDTO.getFatherOccupation() != null) user.setFatherOccupation(userDTO.getFatherOccupation());
        if (userDTO.getMotherName() != null) user.setMotherName(userDTO.getMotherName());
        if (userDTO.getMotherOccupation() != null) user.setMotherOccupation(userDTO.getMotherOccupation());
        if (userDTO.getSiblings() != null) user.setSiblings(userDTO.getSiblings());
        if (userDTO.getFamilyIncome() != null) user.setFamilyIncome(userDTO.getFamilyIncome());
        if (userDTO.getJobType() != null) user.setJobType(userDTO.getJobType());
        if (userDTO.getCompanyName() != null) user.setCompanyName(userDTO.getCompanyName());
        if (userDTO.getAnnualIncome() != null) user.setAnnualIncome(userDTO.getAnnualIncome());
        if (userDTO.getHobbies() != null) user.setHobbies(userDTO.getHobbies());
        if (userDTO.getInterests() != null) user.setInterests(userDTO.getInterests());
        if (userDTO.getMembershipType() != null) user.setMembershipType(userDTO.getMembershipType());
        if (userDTO.getPhoto() != null) user.setPhoto(userDTO.getPhoto());
        if (userDTO.getPhotos() != null) {
            user.setPhotos(serializePhotos(userDTO.getPhotos()));
            if (!userDTO.getPhotos().isEmpty()) {
                user.setPhoto(userDTO.getPhotos().get(0));
            }
        }
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
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setGender(user.getGender());
        userDTO.setMaritalStatus(user.getMaritalStatus());
        userDTO.setContactNumber(user.getContactNumber());
        userDTO.setAlternateContact(user.getAlternateContact());
        userDTO.setOccupation(user.getOccupation());
        userDTO.setEducation(user.getEducation());
        userDTO.setBloodGroup(user.getBloodGroup());
        userDTO.setHeight(user.getHeight());
        userDTO.setWeight(user.getWeight());
        userDTO.setReligion(user.getReligion());
        userDTO.setCaste(user.getCaste());
        userDTO.setSubCaste(user.getSubCaste());
        userDTO.setCurrentAddress(user.getCurrentAddress());
        userDTO.setPermanentAddress(user.getPermanentAddress());
        userDTO.setFatherName(user.getFatherName());
        userDTO.setFatherOccupation(user.getFatherOccupation());
        userDTO.setMotherName(user.getMotherName());
        userDTO.setMotherOccupation(user.getMotherOccupation());
        userDTO.setSiblings(user.getSiblings());
        userDTO.setFamilyIncome(user.getFamilyIncome());
        userDTO.setJobType(user.getJobType());
        userDTO.setCompanyName(user.getCompanyName());
        userDTO.setAnnualIncome(user.getAnnualIncome());
        userDTO.setHobbies(user.getHobbies());
        userDTO.setInterests(user.getInterests());
        userDTO.setMembershipType(user.getMembershipType());
        userDTO.setPhoto(user.getPhoto());
        userDTO.setPhotos(parsePhotos(user.getPhotos()));
        userDTO.setIsActive(user.getIsActive());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        return userDTO;
    }

    private List<String> parsePhotos(String photosJson) {
        if (photosJson == null || photosJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(photosJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse photos JSON: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private String serializePhotos(List<String> photos) {
        if (photos == null || photos.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(photos);
        } catch (Exception e) {
            log.warn("Failed to serialize photos list: {}", e.getMessage());
            return null;
        }
    }
}
