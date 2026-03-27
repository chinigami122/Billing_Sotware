package in.bouziani.billingsoftwar.service;

import in.bouziani.billingsoftwar.io.UserProfileResponse;
import in.bouziani.billingsoftwar.io.UserProfileUpdateRequest;
import in.bouziani.billingsoftwar.io.UserRequest;
import in.bouziani.billingsoftwar.io.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    String getUserRole(String email);
    List<UserResponse> readUsers();
    void deleteUser(String id);
    void updateProfile(UserProfileUpdateRequest request);
    UserProfileResponse getCurrentProfile();
}
