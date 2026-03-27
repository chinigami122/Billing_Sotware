package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.entity.UserEntity;
import in.bouziani.billingsoftwar.io.UserProfileResponse;
import in.bouziani.billingsoftwar.io.UserProfileUpdateRequest;
import in.bouziani.billingsoftwar.io.UserRequest;
import in.bouziani.billingsoftwar.io.UserResponse;
import in.bouziani.billingsoftwar.repositry.UserRepositry;
import in.bouziani.billingsoftwar.service.ActivityLogService;
import in.bouziani.billingsoftwar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepositry userRepositry;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity newUser = converToEntity(request);
        newUser = userRepositry.save(newUser);
        return converToResponse(newUser);
    }

    private UserResponse converToResponse(UserEntity newUser) {
        return UserResponse.builder()
                .name(newUser.getName())
                .email(newUser.getEmail())
                .userId(newUser.getUserId())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdated_at())
                .role(newUser.getRole())
                .build();
    }

    private UserEntity converToEntity(UserRequest request) {
        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().toUpperCase())
                .name(request.getName())
                .build();
    }

    @Override
    public String getUserRole(String email) {
        UserEntity existingUser = userRepositry.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with that email note found"));
        return existingUser.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepositry.findAll()
                .stream()
                .map(user -> converToResponse(user))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity existingUser = userRepositry.findByUserId(id)
                .orElseThrow(() -> new UsernameNotFoundException("User note found"));
        userRepositry.delete(existingUser);
    }

    @Override
    public void updateProfile(UserProfileUpdateRequest request) {
        String currentUserEmail = getAuthenticatedUserEmail();

        UserEntity existingUser = userRepositry.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            existingUser.setName(request.getName().trim());
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            existingUser.setEmail(request.getEmail().trim());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepositry.save(existingUser);

        try {
            activityLogService.logActivity(
                    "PROFILE_UPDATED",
                    "User updated their profile details",
                    currentUserEmail
            );
        } catch (Exception e) {
            System.err.println("Failed to log profile update activity: " + e.getMessage());
        }
    }

    @Override
    public UserProfileResponse getCurrentProfile() {
        String currentUserEmail = getAuthenticatedUserEmail();

        UserEntity existingUser = userRepositry.findByEmail(currentUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));

        return UserProfileResponse.builder()
                .name(existingUser.getName())
                .email(existingUser.getEmail())
                .build();
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().trim().isEmpty()) {
            throw new UsernameNotFoundException("Authenticated user not found");
        }
        return authentication.getName();
    }
}
