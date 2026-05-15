package com.wedservice.backend.module.destinations.service;

import com.wedservice.backend.module.destinations.entity.Destination;

/**
 * Quản lý {@code destination_path} / {@code destination_level} (path enumeration) sau khi tạo hoặc đổi parent.
 */
public interface DestinationHierarchyService {

    void assignPathAndLevelForNewDestination(Destination destination);

    /**
     * Gọi sau khi entity đã có {@code id} (flush). Cập nhật path/level cho nút và toàn bộ cây con.
     */
    void refreshPathsFromNode(Long destinationId);
}
