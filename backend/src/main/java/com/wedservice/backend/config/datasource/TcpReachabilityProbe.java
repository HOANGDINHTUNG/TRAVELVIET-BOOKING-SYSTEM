package com.wedservice.backend.config.datasource;

import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * Kiểm tra TCP tới host:port (phân biệt firewall Aiven vs lỗi SSL/MySQL).
 */
final class TcpReachabilityProbe {

    private TcpReachabilityProbe() {
    }

    static Result probe(String host, int port, int timeoutMs) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), Math.max(1000, timeoutMs));
            return new Result(true, "TCP " + host + ":" + port + " reachable");
        } catch (Exception ex) {
            String msg = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
            return new Result(false, "TCP " + host + ":" + port + " unreachable: " + msg);
        }
    }

    record Result(boolean reachable, String detail) {
    }
}
