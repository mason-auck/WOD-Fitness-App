package com.wodlog.workoutbackend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;

public class UnitSystemValidator implements ConstraintValidator<UnitSystem, String> {

  private static final Set<String> ALLOWED = Set.of("imperial", "metric");

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    return value == null || ALLOWED.contains(value);
  }
}
