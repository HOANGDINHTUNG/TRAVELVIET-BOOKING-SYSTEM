package com.wedservice.backend.config.cache;

import org.springframework.cache.Cache;

import java.util.concurrent.Callable;

/**
 * L1 (Caffeine, pod-local) + L2 (Redis, cluster-wide) read-through cache.
 */
public class TwoLevelCache implements Cache {

    private final String name;
    private final Cache l1;
    private final Cache l2;

    public TwoLevelCache(String name, Cache l1, Cache l2) {
        this.name = name;
        this.l1 = l1;
        this.l2 = l2;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Object getNativeCache() {
        return l2.getNativeCache();
    }

    @Override
    public ValueWrapper get(Object key) {
        ValueWrapper hit = l1.get(key);
        if (hit != null) {
            return hit;
        }
        ValueWrapper remote = l2.get(key);
        if (remote != null && remote.get() != null) {
            l1.put(key, remote.get());
        }
        return remote;
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T> T get(Object key, Class<T> type) {
        T hit = l1.get(key, type);
        if (hit != null) {
            return hit;
        }
        T remote = l2.get(key, type);
        if (remote != null) {
            l1.put(key, remote);
        }
        return remote;
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T> T get(Object key, Callable<T> valueLoader) {
        ValueWrapper wrapper = get(key);
        if (wrapper != null) {
            return (T) wrapper.get();
        }
        try {
            T loaded = valueLoader.call();
            put(key, loaded);
            return loaded;
        } catch (Exception ex) {
            throw new ValueRetrievalException(key, valueLoader, ex);
        }
    }

    @Override
    public void put(Object key, Object value) {
        l1.put(key, value);
        l2.put(key, value);
    }

    @Override
    public void evict(Object key) {
        l1.evict(key);
        l2.evict(key);
    }

    @Override
    public boolean evictIfPresent(Object key) {
        boolean l1Evicted = l1.evictIfPresent(key);
        boolean l2Evicted = l2.evictIfPresent(key);
        return l1Evicted || l2Evicted;
    }

    @Override
    public void clear() {
        l1.clear();
        l2.clear();
    }

    public Cache getL1() {
        return l1;
    }

    public Cache getL2() {
        return l2;
    }
}
