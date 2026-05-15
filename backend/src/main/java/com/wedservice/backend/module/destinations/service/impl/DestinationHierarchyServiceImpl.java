package com.wedservice.backend.module.destinations.service.impl;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.service.DestinationHierarchyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationHierarchyServiceImpl implements DestinationHierarchyService {

    private final DestinationRepository destinationRepository;

    @Override
    @Transactional
    public void assignPathAndLevelForNewDestination(Destination destination) {
        if (destination.getId() == null) {
            throw new IllegalStateException("Destination must be persisted (id assigned) before path assignment");
        }
        applyPathAndLevel(destination);
        destinationRepository.save(destination);
    }

    @Override
    @Transactional
    public void refreshPathsFromNode(Long destinationId) {
        Destination root = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found: " + destinationId));
        Deque<Destination> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Destination current = queue.removeFirst();
            applyPathAndLevel(current);
            destinationRepository.save(current);
            List<Destination> children = destinationRepository.findByParent_IdAndDeletedAtIsNullOrderByNameAsc(
                    current.getId()
            );
            queue.addAll(children);
        }
    }

    private static void applyPathAndLevel(Destination d) {
        Destination parent = d.getParent();
        if (parent == null) {
            d.setLevel(0);
            d.setPath("/" + d.getId() + "/");
            return;
        }
        String parentPath = parent.getPath();
        if (!StringUtils.hasText(parentPath)) {
            parentPath = "/" + parent.getId() + "/";
        }
        if (!parentPath.endsWith("/")) {
            parentPath = parentPath + "/";
        }
        Integer pl = parent.getLevel();
        d.setLevel(pl == null ? 1 : pl + 1);
        d.setPath(parentPath + d.getId() + "/");
    }
}
