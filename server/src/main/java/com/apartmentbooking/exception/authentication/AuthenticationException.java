package com.apartmentbooking.exception.authentication;

import lombok.Getter;

import java.util.Map;

@Getter
public class AuthenticationException extends RuntimeException {
    public static final String DETAIL = "Authentication failed";
    private final Map<String, Object> validationErrors;
    public AuthenticationException(Map<String, Object> errors) {
        validationErrors = errors;
    }
}
