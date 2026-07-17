package com.wodlog.workoutbackend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;

public class WodTypeValidator implements ConstraintValidator<ValidWodType, String> {

  private static final Set<String> ALLOWED =
      Set.of("For Time", "Weight", "Reps & Time", "AMRAP", "Custom");

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    return value == null || ALLOWED.contains(value);
  }
}
