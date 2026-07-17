package com.wodlog.workoutbackend.config;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

  /** Keep JSON as camelCase to match the Expo frontend TypeScript models. */
  @Bean
  Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
    return builder -> builder.propertyNamingStrategy(PropertyNamingStrategies.LOWER_CAMEL_CASE);
  }
}
