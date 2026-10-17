package com.landlock.security;

import com.landlock.user.AppUser;
import com.landlock.user.UserRepository;
import com.landlock.user.UserStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new LandLockUserDetails(user);
    }

    @Getter
    public static class LandLockUserDetails implements UserDetails {
        private final UUID id;
        private final UUID institutionId;
        private final String username;
        private final String password;
        private final String displayName;
        private final Role role;
        private final boolean enabled;
        private final Collection<? extends GrantedAuthority> authorities;

        public LandLockUserDetails(AppUser user) {
            this.id = user.getId();
            this.institutionId = user.getInstitutionId();
            this.username = user.getUsername();
            this.password = user.getPasswordHash();
            this.displayName = user.getDisplayName();
            this.role = user.getRole();
            this.enabled = user.getStatus() == UserStatus.ACTIVE;
            this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public String getUsername() {
            return username;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return enabled;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return enabled;
        }
    }
}
