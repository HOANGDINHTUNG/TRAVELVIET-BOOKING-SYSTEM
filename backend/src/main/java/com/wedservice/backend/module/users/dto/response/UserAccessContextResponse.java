package com.wedservice.backend.module.users.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserAccessContextResponse {
    private UserResponse user;
    private List<String> roles;
    private List<String> permissions;
    private List<String> managementRoles;
    private Boolean hasManagementAccess;
    private Boolean isSuperAdmin;
}
