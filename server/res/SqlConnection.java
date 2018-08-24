<SqlConnectionPackage>;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.PreparedStatement;

public final class SqlConnection {
	private static SqlConnection instance = new SqlConnection();
	private Connection conn;

	private SqlConnection() {
		try {
			conn = DriverManager.getConnection("MY URL", "DB USER", "DB PASS");
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	public static SqlConnection getInstance() {
		return instance;
	}

	public PreparedStatement getStatement(String query) throws Exception {
		PreparedStatement res = null;
		try {
			res = conn.prepareStatement(query);
		} catch(Exception e) {
			throw e;
		}
		return res;
	}

	public void close() throws Exception {
		try {
			conn.close();
		} catch(Exception e) {
			throw e;
		}
	}
}
