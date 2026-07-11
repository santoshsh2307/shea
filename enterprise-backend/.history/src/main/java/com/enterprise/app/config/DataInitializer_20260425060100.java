package com.enterprise.app.config;

import com.enterprise.app.entity.User;
import com.enterprise.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing database with sample data...");
        
        // Create admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@enterprise.com");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setContactNumber("9999999999");
            admin.setOccupation("Administrator");
            admin.setEducation("Bachelor's");
            admin.setBloodGroup("O+");
            admin.setMembershipType("Premium");
            admin.setIsActive(true);
            
            userRepository.save(admin);
            log.info("Admin user created");
        }

        // Create sample users
        if (userRepository.count() < 2) {
            User user1 = new User();
            user1.setUsername("john_doe");
            user1.setPassword("password123");
            user1.setEmail("john@example.com");
            user1.setFirstName("John");
            user1.setLastName("Doe");
            user1.setContactNumber("9876543210");
            user1.setOccupation("Software Engineer");
            user1.setEducation("Bachelor's");
            user1.setBloodGroup("A+");
            user1.setMembershipType("Standard");
            user1.setIsActive(true);

            User user2 = new User();
            user2.setUsername("jane_smith");
            user2.setPassword("password456");
            user2.setEmail("jane@example.com");
            user2.setFirstName("Jane");
            user2.setLastName("Smith");
            user2.setContactNumber("9123456789");
            user2.setOccupation("Product Manager");
            user2.setEducation("Master's");
            user2.setBloodGroup("B+");
            user2.setMembershipType("Premium");
            user2.setIsActive(true);

            userRepository.saveAll(java.util.Arrays.asList(user1, user2));
            log.info("Sample users created");
        }

        log.info("Database initialization completed");
    }
}
