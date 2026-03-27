package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.UserRequest;
import in.bouziani.billingsoftwar.io.UserResponse;
import in.bouziani.billingsoftwar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class UserController {
    private final UserService userService;
    private final ThreadPoolTaskExecutor threadPoolTaskExecutor;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(@RequestBody UserRequest request){
        try {
            return userService.createUser(request);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST , "Unable to create user");
        }
    }
    @GetMapping("/users")
    public List<UserResponse> readUsers(){
        return userService.readUsers();
    }
    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String id){
        try{
            userService.deleteUser(id);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND , "User not found");
        }
    }
}
