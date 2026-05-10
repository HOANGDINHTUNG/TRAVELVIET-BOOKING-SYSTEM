package com.wedservice.backend.module.destinations.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.destinations.dto.response.DestinationFollowResponse;
import com.wedservice.backend.module.destinations.facade.DestinationFollowFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Canonical self-profile path for destination follows.
 * Legacy: {@code GET /destinations/me/follows} on {@link DestinationFollowController}.
 */
@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserMeDestinationFollowsController {

    private final DestinationFollowFacade destinationFollowFacade;

    @GetMapping("/destination-follows")
    public ApiResponse<PageResponse<DestinationFollowResponse>> getMyDestinationFollows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(destinationFollowFacade.getMyFollows(page, size));
    }
}
