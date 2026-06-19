package com.wedservice.backend.config.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.wedservice.backend.config.AppCacheProperties;
import com.wedservice.backend.config.CacheConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * {@code app.cache.mode=redis}: tour caches on Redis; destination caches stay local Caffeine.
 */
@Configuration
@ConditionalOnClass(RedisConnectionFactory.class)
@ConditionalOnProperty(prefix = "app.cache", name = "mode", havingValue = "redis")
public class DistributedRedisCacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager(
            RedisConnectionFactory connectionFactory,
            AppCacheProperties props
    ) {
        Jackson2JsonRedisSerializer<Object> serializer = redisSerializer();

        Map<String, org.springframework.data.redis.cache.RedisCacheConfiguration> redisConfigs = new HashMap<>();
        redisConfigs.put(
                CacheConfig.CACHE_TOURS,
                redisCacheConfig(props, CacheConfig.CACHE_TOURS, serializer)
        );
        redisConfigs.put(
                CacheConfig.CACHE_TOUR_DETAILS,
                redisCacheConfig(props, CacheConfig.CACHE_TOUR_DETAILS, serializer)
        );

        RedisCacheManager redisManager = RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(redisCacheConfig(props, CacheConfig.CACHE_TOURS, serializer))
                .withInitialCacheConfigurations(redisConfigs)
                .build();
        redisManager.initializeCaches();

        List<Cache> caches = new ArrayList<>();
        caches.add(requireCache(redisManager, CacheConfig.CACHE_TOURS));
        caches.add(requireCache(redisManager, CacheConfig.CACHE_TOUR_DETAILS));
        caches.add(CacheSpecFactory.buildCaffeineCache(CacheConfig.CACHE_DESTINATIONS, props));
        caches.add(CacheSpecFactory.buildCaffeineCache(CacheConfig.CACHE_DESTINATION_DETAILS, props));

        SimpleCacheManager composite = new SimpleCacheManager();
        composite.setCaches(caches);
        composite.initializeCaches();
        return composite;
    }

    @Bean(name = "redisCacheTemplate")
    public RedisTemplate<String, Object> redisCacheTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(redisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(redisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    private static Cache requireCache(RedisCacheManager manager, String name) {
        Cache cache = manager.getCache(name);
        if (cache == null) {
            throw new IllegalStateException("Redis cache not initialized: " + name);
        }
        return cache;
    }

    private static org.springframework.data.redis.cache.RedisCacheConfiguration redisCacheConfig(
            AppCacheProperties props,
            String cacheName,
            Jackson2JsonRedisSerializer<Object> serializer
    ) {
        return org.springframework.data.redis.cache.RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(CacheSpecFactory.ttlFor(cacheName, props))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(serializer)
                )
                .disableCachingNullValues();
    }

    private static Jackson2JsonRedisSerializer<Object> redisSerializer() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        
        // Kích hoạt nhận diện Type tự động (Thay thế cơ chế hoạt động cũ của GenericJackson2JsonRedisSerializer)
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL
        );
        
        return new Jackson2JsonRedisSerializer<>(mapper, Object.class);
    }
}