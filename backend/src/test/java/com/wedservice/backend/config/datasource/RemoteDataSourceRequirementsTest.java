package com.wedservice.backend.config.datasource;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RemoteDataSourceRequirementsTest {

    @Test
    void requireConfiguredForProd_rejectsStaleExampleHost() {
        AppDataSourceFailoverProperties.Remote remote = new AppDataSourceFailoverProperties.Remote();
        remote.setHost(RemoteDataSourceRequirements.STALE_EXAMPLE_HOST);
        remote.setPort(23132);
        remote.setPassword("secret");

        assertThatThrownBy(() -> RemoteDataSourceRequirements.requireConfiguredForProd(remote))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("hostname mẫu cũ");
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
