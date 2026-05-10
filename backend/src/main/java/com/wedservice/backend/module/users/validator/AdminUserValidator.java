package com.wedservice.backend.module.users.validator;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AdminUserValidator {

    private final UserRepository userRepository;

    public void validateRequiredContact(String email, String phone) {
        if (!StringUtils.hasText(email) && !StringUtils.hasText(phone)) {
            throw BadRequestException.i18n("api.error.common.contactRequired");
        }
    }

    public void validateUniqueContacts(String email, String phone, UUID currentUserId) {
        if (StringUtils.hasText(email)) {
            boolean emailExists = currentUserId == null
                    ? userRepository.existsByEmailIgnoreCase(email)
                    : userRepository.existsByEmailIgnoreCaseAndIdNot(email, currentUserId);
            if (emailExists) {
                throw BadRequestException.i18n("api.error.common.emailExists");
            }
        }

        if (StringUtils.hasText(phone)) {
            boolean phoneExists = currentUserId == null
                    ? userRepository.existsByPhone(phone)
                    : userRepository.existsByPhoneAndIdNot(phone, currentUserId);
            if (phoneExists) {
                throw BadRequestException.i18n("api.error.common.phoneExists");
            }
        }
    }
}
