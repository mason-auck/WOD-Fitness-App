package com.wodlog.workoutbackend.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ErrorResponse> handleApiException(
      ApiException ex, HttpServletRequest request) {
    return ResponseEntity.status(ex.getStatus())
        .body(
            new ErrorResponse(
                Instant.now(),
                ex.getStatus().value(),
                ex.getCode(),
                ex.getMessage(),
                request.getRequestURI(),
                List.of()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    List<ErrorResponse.FieldErrorDetail> fieldErrors =
        ex.getBindingResult().getFieldErrors().stream().map(this::toFieldError).toList();

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(
            new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                "Request validation failed",
                request.getRequestURI(),
                fieldErrors));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnexpected(
      Exception ex, HttpServletRequest request) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
            new ErrorResponse(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_ERROR",
                "An unexpected error occurred",
                request.getRequestURI(),
                List.of()));
  }

  private ErrorResponse.FieldErrorDetail toFieldError(FieldError error) {
    return new ErrorResponse.FieldErrorDetail(error.getField(), error.getDefaultMessage());
  }
}
