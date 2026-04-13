package com.starto.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String name = ex.getName();
        String type = ex.getRequiredType().getSimpleName();
        Object value = ex.getValue();
        String message = String.format("'%s' should be a valid %s and '%s' is not", name, type, value);
        
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        if (ex.getMessage().contains("not found")) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
        return ResponseEntity.status(403).body(Map.of("error", ex.getMessage()));
    }
}
