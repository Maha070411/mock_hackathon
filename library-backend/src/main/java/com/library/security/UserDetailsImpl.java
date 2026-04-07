package com.library.security;

import com.library.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private String role;
    private String department;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String fullName, String email, String password, String role, String department) {
        this.id = id; this.fullName = fullName; this.email = email; this.password = password;
        this.role = role; this.department = department;
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(
            user.getId(), user.getFullName(), user.getEmail(), user.getPassword(),
            user.getRole().name(), user.getDepartment()
        );
    }
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public String getDepartment() { return department; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
