package com.wodlog.workoutbackend.security;

import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 * Resolves the authenticated Supabase user id ({@code sub} claim) from the security context.
 */
public final class CurrentUser {

  private CurrentUser() {}

  public static UUID id() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
      throw new IllegalStateException("No JWT authentication present");
    }
    Jwt jwt = jwtAuth.getToken();
    String sub = jwt.getSubject();
    if (sub == null || sub.isBlank()) {
      throw new IllegalStateException("JWT missing subject claim");
    }
    return UUID.fromString(sub);
  }
}
