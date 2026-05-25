package com.wedservice.backend.config.datasource;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Kiểm tra TCP tới host:port (phân biệt firewall Aiven vs lỗi SSL/MySQL).
 */
final class TcpReachabilityProbe {

    private TcpReachabilityProbe() {
    }

    static Result probe(String host, int port, int timeoutMs) {
        int timeout = Math.max(1000, timeoutMs);
        Exception last = null;
        try {
            InetAddress[] addresses = InetAddress.getAllByName(host);
            List<InetAddress> ordered = orderAddresses(addresses);
            for (InetAddress address : ordered) {
                try (Socket socket = new Socket()) {
                    socket.connect(new InetSocketAddress(address, port), timeout);
                    return new Result(
                            true,
                            "TCP " + host + ":" + port + " reachable via " + address.getHostAddress()
                    );
                } catch (Exception ex) {
                    last = ex;
                }
            }
        } catch (Exception ex) {
            last = ex;
        }
        return new Result(false, formatFailure(host, port, last));
    }

    private static List<InetAddress> orderAddresses(InetAddress[] addresses) {
        List<InetAddress> ordered = new ArrayList<>(List.of(addresses));
        ordered.sort(Comparator.comparingInt(addr -> addr instanceof java.net.Inet4Address ? 0 : 1));
        return ordered;
    }

    private static String formatFailure(String host, int port, Exception ex) {
        if (ex == null) {
            return "TCP " + host + ":" + port + " unreachable: no route";
        }
        String kind = classify(ex);
        String msg = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
        return "TCP " + host + ":" + port + " unreachable (" + kind + "): " + msg;
    }

    private static String classify(Exception ex) {
        if (ex instanceof UnknownHostException) {
            return "DNS";
        }
        if (ex instanceof SocketTimeoutException) {
            return "timeout";
        }
        String name = ex.getClass().getSimpleName();
        if (name.contains("Connect")) {
            return "connection refused or filtered";
        }
        return name;
    }

    record Result(boolean reachable, String detail) {
    }
}
