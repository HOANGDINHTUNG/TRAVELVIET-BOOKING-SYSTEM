import java.sql.Connection;
import java.sql.DriverManager;

public class TestDB {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true", "wed_app_user", "123456");
            conn.createStatement().executeUpdate("DROP DATABASE IF EXISTS wedservice;");
            conn.createStatement().executeUpdate("CREATE DATABASE wedservice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            System.out.println("Recreated database wedservice!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
