package com.telusko.SpringEcom.model.dto;

public record LoginResponse(
        String token,
        String name,
        String email,
        String role
) {
}