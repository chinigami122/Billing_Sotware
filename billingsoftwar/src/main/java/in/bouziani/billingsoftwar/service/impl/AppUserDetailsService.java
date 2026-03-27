package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.entity.UserEntity;
import in.bouziani.billingsoftwar.repositry.UserRepositry;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepositry userRepositry;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity existingUser = userRepositry.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email note found for that email: "+email));

        String rawRole = existingUser.getRole() == null ? "" : existingUser.getRole().trim().toUpperCase();
        if (rawRole.isEmpty()) {
            throw new UsernameNotFoundException("User role is missing for email: " + email);
        }

        // Extract plain role name (remove ROLE_ prefix if present)
        String plainRole = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(plainRole));

        return new User(existingUser.getEmail(), existingUser.getPassword(), authorities);
    }
}
