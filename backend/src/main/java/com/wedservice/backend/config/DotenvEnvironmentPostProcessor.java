package com.wedservice.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.StandardEnvironment;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "travelvietDotenv";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> dotenvValues = loadDotenvValues();

        if (dotenvValues.isEmpty()) {
            return;
        }

        MutablePropertySources propertySources = environment.getPropertySources();
        MapPropertySource dotenvSource = new MapPropertySource(PROPERTY_SOURCE_NAME, dotenvValues);

        if (propertySources.contains(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME)) {
            propertySources.addAfter(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME, dotenvSource);
            return;
        }

        propertySources.addLast(dotenvSource);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 20;
    }

    private Map<String, Object> loadDotenvValues() {
        Map<String, Object> values = new LinkedHashMap<>();

        for (Path path : getCandidatePaths()) {
            if (!Files.isRegularFile(path)) {
                continue;
            }

            try {
                for (String rawLine : Files.readAllLines(path, StandardCharsets.UTF_8)) {
                    parseLine(rawLine, values);
                }
            } catch (IOException ignored) {
                // Ignore local dotenv read failures so app startup still follows Spring defaults.
            }
        }

        return values;
    }

    private List<Path> getCandidatePaths() {
        Path cwd = Paths.get("").toAbsolutePath().normalize();
        List<Path> paths = new ArrayList<>();
        paths.add(cwd.resolve(".env").normalize());
        paths.add(cwd.resolve("backend").resolve(".env").normalize());

        Path parent = cwd.getParent();
        if (parent != null) {
            paths.add(parent.resolve("backend").resolve(".env").normalize());
        }

        return paths.stream().distinct().toList();
    }

    private void parseLine(String rawLine, Map<String, Object> values) {
        String line = rawLine.trim();

        if (line.isEmpty() || line.startsWith("#")) {
            return;
        }

        if (line.startsWith("export ")) {
            line = line.substring("export ".length()).trim();
        }

        int separatorIndex = line.indexOf('=');
        if (separatorIndex <= 0) {
            return;
        }

        String key = line.substring(0, separatorIndex).trim();
        String value = line.substring(separatorIndex + 1).trim();

        if (key.isEmpty()) {
            return;
        }

        values.putIfAbsent(key, stripQuotes(value));
    }

    private String stripQuotes(String value) {
        if (value.length() < 2) {
            return value;
        }

        char first = value.charAt(0);
        char last = value.charAt(value.length() - 1);

        if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
            return value.substring(1, value.length() - 1);
        }

        return value;
    }
}
