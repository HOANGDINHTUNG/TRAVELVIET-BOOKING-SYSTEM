package com.wedservice.backend.config.datasource;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MysqlServiceUriResolverTest {

    @Test
    void applyUri_parsesMysqlServiceUri() {
        AppDataSourceFailoverProperties.Remote remote = new AppDataSourceFailoverProperties.Remote();
        remote.setHost("old.example.com");
        remote.setPort(3306);

        boolean applied = MysqlServiceUriResolver.applyUri(
                remote,
                "mysql://avnadmin:secret%21@mysql-lab.example.com:23132/defaultdb?ssl-mode=REQUIRED"
        );

        assertThat(applied).isTrue();
        assertThat(remote.getHost()).isEqualTo("mysql-lab.example.com");
        assertThat(remote.getPort()).isEqualTo(23132);
        assertThat(remote.getDatabase()).isEqualTo("defaultdb");
        assertThat(remote.getUsername()).isEqualTo("avnadmin");
        assertThat(remote.getPassword()).isEqualTo("secret!");
        assertThat(remote.getSslMode()).isEqualTo("REQUIRED");
    }

    @Test
    void applyUri_parsesJdbcPrefix() {
        AppDataSourceFailoverProperties.Remote remote = new AppDataSourceFailoverProperties.Remote();

        boolean applied = MysqlServiceUriResolver.applyUri(
                remote,
                "jdbc:mysql://mysql-lab.example.com:23132/defaultdb"
        );

        assertThat(applied).isTrue();
        assertThat(remote.getHost()).isEqualTo("mysql-lab.example.com");
        assertThat(remote.getPort()).isEqualTo(23132);
        assertThat(remote.getDatabase()).isEqualTo("defaultdb");
    }
}
