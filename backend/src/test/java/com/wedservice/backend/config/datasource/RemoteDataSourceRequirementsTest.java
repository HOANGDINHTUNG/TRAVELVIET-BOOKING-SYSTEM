package com.wedservice.backend.config.datasource;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RemoteDataSourceRequirementsTest {

    @Test
    void requireConfiguredForProd_acceptsAivenPublicHost() {
        AppDataSourceFailoverProperties.Remote remote = new AppDataSourceFailoverProperties.Remote();
        remote.setHost("mysql-lab-mtung3365-864a.f.aivencloud.com");
        remote.setPort(23132);
        remote.setPassword("secret");

        assertThatCode(() -> RemoteDataSourceRequirements.requireConfiguredForProd(remote))
                .doesNotThrowAnyException();
    }

    @Test
    void requireConfiguredForProd_requiresHost() {
        AppDataSourceFailoverProperties.Remote remote = new AppDataSourceFailoverProperties.Remote();
        remote.setPassword("secret");

        assertThatThrownBy(() -> RemoteDataSourceRequirements.requireConfiguredForProd(remote))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("MYSQL_SERVICE_URI");
    }
}
