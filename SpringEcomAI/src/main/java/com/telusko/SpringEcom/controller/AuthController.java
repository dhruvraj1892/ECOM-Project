package com.telusko.SpringEcom.controller;

import com.telusko.SpringEcom.model.User;
import com.telusko.SpringEcom.model.dto.AuthResponse;
import com.telusko.SpringEcom.model.dto.LoginRequest;
import com.telusko.SpringEcom.model.dto.LoginResponse;
import com.telusko.SpringEcom.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            User savedUser = authService.register(user);

            AuthResponse response = new AuthResponse(
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getRole()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        String token =authService.login(loginRequest.email(), loginRequest.password());
        System.out.println("token: "+ token);
     User user=authService.getUserByEmail(loginRequest.email());
        LoginResponse response = new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
        System.out.println("response: "+user.getName());
        return ResponseEntity.ok(response);
    }
}
