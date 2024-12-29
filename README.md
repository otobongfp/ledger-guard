# **Blockchain Powered Audit Logs and Identity Management System**

## **Overview**

This project is a NestJS-based backend system designed for robust **auditable event logging** and **identity management** using **blockchain technology** (LTO Network). The system ensures immutable logs, secure identity management, and streamlined operations for software security.

---

## **Features**

- **Event Logging**: Captures user actions and system events in various categories.
- **Blockchain Integration**: Uses LTO Network to anchor logs for immutability.
- **Identity Management**: Supports user registration, role assignment, and approval workflows.
- **HTTP Signature Authentication**: Ensures secure interactions using signed HTTP requests.
- **Redis Integration**: Serves as the primary data store for user and log data.
- **Swagger Documentation**: Provides easy-to-use API documentation.

---

## **Project Structure**

### **Core Modules**

- **Users Module**: Manages user registration, approval, and role assignment.
- **Events Module**: Handles event logging and blockchain anchoring.
- **Middleware**: Verifies HTTP signatures and associates requests with authenticated users.

---

## **Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/event-logging-system.git
   cd event-logging-system
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file and configure the following variables:

   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   LTO_NETWORK_ID=T
   LTO_SEED=your-wallet-seed
   ```

4. **Run the application**:
   ```bash
   npm run start
   ```

## **Log Types**

| **Category**               | **Log Type**                    | **Example Field**                     |
| -------------------------- | ------------------------------- | ------------------------------------- |
| Authentication & Access    | Login attempt (success/failure) | `userId`, `status`, `timestamp`, `ip` |
|                            | Password reset/change           | `userId`, `timestamp`                 |
|                            | API key usage                   | `keyId`, `action`, `timestamp`        |
| Configuration Changes      | Config updates                  | `userId`, `changes`                   |
|                            | RBAC modifications              | `userId`, `role`, `changes`           |
| Data Access & Modification | Record updates                  | `userId`, `recordId`, `changes`       |
|                            | Sensitive data access           | `userId`, `dataId`, `timestamp`       |
| Operational Events         | Deployments                     | `environment`, `version`, `userId`    |
|                            | Monitoring alerts               | `metric`, `value`, `threshold`        |
| Security & Anomalies       | Multiple failed login attempts  | `userId`, `failedAttempts`, `ip`      |
|                            | SQL injection detected          | `endpoint`, `query`, `timestamp`      |
| Audit & Compliance         | Audit log access                | `auditorId`, `logId`, `timestamp`     |

---

## **Development Notes**

1. **Event Timestamp**:

   - All timestamps are generated on the server to ensure accuracy and prevent tampering.

2. **HTTP Signature Authentication**:

   - Secure all requests with HTTP Message Signatures, verifying the authenticity and integrity of the signer.

3. **Redis**:
   - Serves as the primary data store for:
     - User information (`users:{publicKey}`)
     - Pending registrations (`pending:users:{publicKey}`)
     - Event chains (`user:{userId}:event_chain`)

---

## **Future Enhancements**

- **Extended Role-Based Access Control (RBAC)**:
  - Define fine-grained permissions based on roles.
- **Enhanced Log Visualization**:
  - Provide dashboards for real-time log monitoring and analytics.
- **Integration with External Systems**:
  - Allow logs to be exported to third-party platforms (e.g., Elasticsearch, AWS CloudWatch).

---

## **Contributors**

- **Otobong Peter** (Author)

For questions, open an issue or contact [..@mail.com].
