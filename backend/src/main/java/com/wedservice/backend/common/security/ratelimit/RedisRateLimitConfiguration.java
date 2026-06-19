package com.wedservice.backend.common.security.ratelimit;

import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ClientSideConfig;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import java.time.Duration;

@Configuration
@ConditionalOnClass(RedisConnectionFactory.class)
@ConditionalOnProperty(prefix = "app.security.rate-limit", name = "store", havingValue = "redis")
public class RedisRateLimitConfiguration {

    @Bean
    public ProxyManager<String> rateLimitProxyManager(RedisConnectionFactory connectionFactory) {
        if (!(connectionFactory instanceof LettuceConnectionFactory lettuce)) {
            throw new IllegalStateException("Bucket4j Redis integration requires LettuceConnectionFactory");
        }
        RedisClient client = (RedisClient) lettuce.getNativeClient();
        StatefulRedisConnection<String, byte[]> connection = client.connect(
                RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE)
        );
        return LettuceBasedProxyManager.builderFor(connection)
        .withClientSideConfig(ClientSideConfig.getDefault()
            .withExpirationAfterWriteStrategy(
                ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofMinutes(2))
            )
        )
        .build();
    }

    @Bean
    public RateLimitBucketStore redisRateLimitBucketStore(
            ProxyManager<String> rateLimitProxyManager,
            AppRateLimitProperties props
    ) {
        return new RedisRateLimitBucketStore(rateLimitProxyManager, props);
    }
}
