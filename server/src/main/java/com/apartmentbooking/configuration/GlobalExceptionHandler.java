package com.apartmentbooking.configuration;

import com.apartmentbooking.exception.authentication.AuthenticationException;
import com.apartmentbooking.exception.EntityNotFoundException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.apache.coyote.BadRequestException;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.Collections;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ProblemDetail> handleNotFound(NotFoundException e) {
        String errorResponse = "Resource not found";
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, errorResponse);
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleTokenInvalid(Exception e) {
        String errorResponse = "Token is invalid or expired";
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, errorResponse);
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.UNAUTHORIZED);
    }


    @ExceptionHandler(NoSuchAlgorithmException.class)
    public ResponseEntity<ProblemDetail> handleNoSuchAlgorithmException(NoSuchAlgorithmException e) {
        String errorResponse = "No Such Algorithm";
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, errorResponse);
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleEntityNotFoundException(EntityNotFoundException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleEntityNotFoundException(AuthenticationException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, AuthenticationException.DETAIL);
        problemDetail.setProperties(Collections.unmodifiableMap(e.getValidationErrors()));
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({IllegalArgumentException.class, HttpMessageNotReadableException.class,
            SQLException.class, JsonMappingException.class, BadRequestException.class})
    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(Exception e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ProblemDetail> handleIllegalStateException(IllegalStateException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
        printException(e);
        return new ResponseEntity<>(problemDetail, HttpStatus.BAD_REQUEST);
    }

    private void printException(Exception e) {
        System.err.println(e.getMessage());
        e.printStackTrace();
    }
}