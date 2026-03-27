package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.UserProfileResponse;
import in.bouziani.billingsoftwar.io.UserProfileUpdateRequest;
import in.bouziani.billingsoftwar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class ProfileController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getCurrentProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody UserProfileUpdateRequest request) {
        userService.updateProfile(request);

        // If email was changed, frontend should force logout and ask user to sign in again to refresh JWT claims.
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}

