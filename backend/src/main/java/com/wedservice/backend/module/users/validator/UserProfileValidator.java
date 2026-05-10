package com.wedservice.backend.module.users.validator;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserProfileValidator {

    private final UserRepository userRepository;

    public void validateRequiredContact(String email, String phone) {
        if (!StringUtils.hasText(email) && !StringUtils.hasText(phone)) {
            throw BadRequestException.i18n("api.error.common.contactRequired");
        }
    }

    public void validateUniqueContacts(String email, String phone, UUID currentUserId) {
        if (StringUtils.hasText(email) && userRepository.existsByEmailIgnoreCaseAndIdNot(email, currentUserId)) {
            throw BadRequestException.i18n("api.error.common.emailExists");
        }
        if (StringUtils.hasText(phone) && userRepository.existsByPhoneAndIdNot(phone, currentUserId)) {
            throw BadRequestException.i18n("api.error.common.phoneExists");
        }
    }
}
