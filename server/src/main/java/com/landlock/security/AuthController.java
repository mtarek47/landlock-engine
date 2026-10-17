package com.landlock.security;

import com.landlock.common.ApiResponse;
import com.landlock.user.AppUser;
import com.landlock.user.UserDTO;
import com.landlock.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and session management")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive JWT token")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetailsServiceImpl.LandLockUserDetails userDetails =
                (UserDetailsServiceImpl.LandLockUserDetails) authentication.getPrincipal();

        String token = tokenProvider.generateToken(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getRole(),
                userDetails.getInstitutionId()
        );

        AppUser user = userService.getUserEntityById(userDetails.getId());
        UserDTO userDTO = UserDTO.fromEntity(user);

        LoginResponse response = LoginResponse.of(token, tokenProvider.getExpirationMs(), userDTO);
        return ResponseEntity.ok(ApiResponse.ok("Authentication successful", response));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsServiceImpl.LandLockUserDetails userDetails)) {
            throw new IllegalStateException("No authenticated user found in current context");
        }

        UserDTO userDTO = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(userDTO));
    }
}
