package com.library.controller;

import com.library.model.Role;
import com.library.model.User;
import com.library.payload.Dto;
import com.library.repository.UserRepository;
import com.library.security.JwtUtils;
import com.library.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager; this.userRepository = userRepository;
        this.encoder = encoder; this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Dto.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        return ResponseEntity.ok(new Dto.JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getRole(), userDetails.getFullName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Dto.RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.email())) {
            return ResponseEntity.badRequest().body(new Dto.MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        user.setFullName(signUpRequest.fullName());
        user.setEmail(signUpRequest.email());
        user.setPassword(encoder.encode(signUpRequest.password()));
        user.setRole(Role.valueOf(signUpRequest.role().toUpperCase()));
        user.setDepartment(signUpRequest.department());
        
        userRepository.save(user);
        return ResponseEntity.ok(new Dto.MessageResponse("User registered successfully!"));
    }
}
