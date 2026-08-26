
package com.telusko.SpringEcom.model.dto;

public record AuthResponse(
        String name,
        String email,
        String role
) {
}