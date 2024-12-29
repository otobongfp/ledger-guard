import { Injectable } from '@nestjs/common';
import { LogType, LogInfo } from '../common/interfaces/logInfo';

@Injectable()
export class LogTypeProvider {
  buildEventMessage(logInfo: LogInfo): object {
    const { logType } = logInfo;

    switch (logType) {
      case LogType.LOGIN:
        return {
          '@context': 'auth_event.json',
          action: 'user_login',
          userId: logInfo.userId,
          status: logInfo.metadata?.status || 'unknown',
          timestamp: logInfo.timestamp,
          metadata: logInfo.metadata || {},
        };

      case LogType.LOGOUT:
        return {
          '@context': 'auth_event.json',
          action: 'user_logout',
          userId: logInfo.userId,
          timestamp: logInfo.timestamp,
        };

      case LogType.PASSWORD_CHANGE:
        return {
          '@context': 'auth_event.json',
          action: 'password_change',
          userId: logInfo.userId,
          timestamp: logInfo.timestamp,
        };

      case LogType.CONFIG_CHANGE:
        return {
          '@context': 'config_change.json',
          action: 'update_config',
          userId: logInfo.userId,
          changes: logInfo.changes || {},
          timestamp: logInfo.timestamp,
        };

      case LogType.DATA_UPDATE:
        return {
          '@context': 'data_access.json',
          action: 'update_record',
          userId: logInfo.userId,
          recordId: logInfo.metadata?.recordId || 'unknown',
          changes: logInfo.changes || {},
          timestamp: logInfo.timestamp,
        };

      case LogType.DEPLOYMENT:
        return {
          '@context': 'operation_event.json',
          action: 'deployment',
          userId: logInfo.userId,
          environment: logInfo.metadata?.environment || 'unknown',
          version: logInfo.metadata?.version || 'unknown',
          timestamp: logInfo.timestamp,
        };

      case LogType.ANOMALY_DETECTED:
        return {
          '@context': 'security_alert.json',
          action: 'anomaly_detected',
          userId: logInfo.userId,
          anomalyType: logInfo.metadata?.anomalyType || 'unknown',
          details: logInfo.details || '',
          timestamp: logInfo.timestamp,
        };

      case LogType.SECURITY_ALERT:
        return {
          '@context': 'security_alert.json',
          action: 'security_alert',
          userId: logInfo.userId,
          alertType: logInfo.metadata?.alertType || 'unknown',
          details: logInfo.details || '',
          timestamp: logInfo.timestamp,
        };

      case LogType.AUDIT_LOG:
        return {
          '@context': 'audit_log.json',
          action: 'log_access',
          userId: logInfo.userId,
          auditorId: logInfo.metadata?.auditorId || 'unknown',
          logId: logInfo.metadata?.logId || 'unknown',
          timestamp: logInfo.timestamp,
        };

      default:
        throw new Error(`Unsupported log type: ${logType}`);
    }
  }
}
