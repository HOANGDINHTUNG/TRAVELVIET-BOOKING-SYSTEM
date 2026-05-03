package com.wedservice.backend.module.auth.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.wedservice.backend.module.users.entity.Permission;
import com.wedservice.backend.module.users.entity.Role;
import com.wedservice.backend.module.users.entity.UserRole;
import com.wedservice.backend.module.users.entity.Status;
import com.wedservice.backend.module.users.entity.User;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Getter
public class CustomUserDetails implements UserDetails {

    private final UUID userId;
    private final String fullName;
    private final String username;
    private final String password;
    private final boolean enabled;
    private final Status status;
    private final List<String> roleCodes;
    private final List<? extends GrantedAuthority> authorities;

    private CustomUserDetails(
            UUID userId,
            String fullName,
            String username,
            String password,
            boolean enabled,
            Status status,
            List<String> roleCodes,
            List<? extends GrantedAuthority> authorities
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.status = status;
        this.roleCodes = roleCodes;
        this.authorities = authorities;
    }

    public static CustomUserDetails fromUser(User user) {
        String principal = user.getEmail() != null ? user.getEmail() : user.getPhone();

        List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
        List<String> roleCodes = new java.util.ArrayList<>();

        for (UserRole userRole : effectiveUserRoles(user)) {
            Role role = userRole.getRole();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            roleCodes.add(role.getCode());
            if (role.getPermissions() == null) {
                continue;
            }
            for (Permission perm : role.getPermissions()) {
                if (perm != null
                        && Boolean.TRUE.equals(perm.getIsActive())
                        && perm.getCode() != null
                        && !perm.getCode().isBlank()) {
                    authorities.add(new SimpleGrantedAuthority(perm.getCode()));
                }
            }
        }

        return new CustomUserDetails(
                user.getId(),
                user.getFullName(),
                principal,
                user.getPasswordHash(),
                user.getStatus() == Status.ACTIVE,
                user.getStatus(),
                roleCodes,
                authorities
        );
    }

    private static List<UserRole> effectiveUserRoles(User user) {
        LocalDateTime now = LocalDateTime.now();
        return user.getUserRoles().stream()
                .filter(userRole -> userRole != null && userRole.getRole() != null)
                .filter(userRole -> userRole.getRole().getCode() != null && !userRole.getRole().getCode().isBlank())
                .filter(userRole -> Boolean.TRUE.equals(userRole.getRole().getIsActive()))
                .filter(userRole -> userRole.getExpiredAt() == null || userRole.getExpiredAt().isAfter(now))
                .sorted(Comparator
                        .comparing((UserRole userRole) -> Boolean.TRUE.equals(userRole.getIsPrimary())).reversed()
                        .thenComparing(
                                userRole -> userRole.getRole().getHierarchyLevel() == null
                                        ? 0
                                        : userRole.getRole().getHierarchyLevel(),
                                Comparator.reverseOrder()
                        )
                        .thenComparing(userRole -> userRole.getRole().getCode(), String.CASE_INSENSITIVE_ORDER))
                .toList();
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
        return status != Status.BLOCKED;
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
