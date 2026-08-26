
package com.telusko.SpringEcom.model.dto;

public record LoginRequest(
        String email,
        String password
) {
}