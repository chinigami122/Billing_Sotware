package in.bouziani.billingsoftwar.controller;

import in.bouziani.billingsoftwar.io.AuthRequest;
import in.bouziani.billingsoftwar.io.AuthResponse;
import in.bouziani.billingsoftwar.service.ActivityLogService;
import in.bouziani.billingsoftwar.service.impl.AppUserDetailsService;
import in.bouziani.billingsoftwar.service.impl.UserServiceImpl;
import in.bouziani.billingsoftwar.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final UserServiceImpl userService;
    private final ActivityLogService activityLogService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) throws Exception{
        authenticate(request.getEmail() , request.getPassword());
        final UserDetails userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        String role = userService.getUserRole(request.getEmail());

        try {
            activityLogService.logActivity(
                    "USER_LOGIN",
                    "User logged in",
                    request.getEmail()
            );
        } catch (Exception e) {
            System.err.println("Failed to log login activity: " + e.getMessage());
        }

        return new AuthResponse(request.getEmail() , role, jwtToken);
    }

    public void authenticate( String email , String password) throws Exception{
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email , password));
        }catch (DisabledException e){
            throw new Exception("User disabled");
        }
    }
    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String , String> request){
        return passwordEncoder.encode(request.get("password"));
    }
}
