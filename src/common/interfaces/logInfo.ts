export interface LogInfo {
  logType: LogType;
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
  changes?: Record<string, any>;
  details?: string;
}

export enum LogType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  CONFIG_CHANGE = 'CONFIG_CHANGE',
  DATA_UPDATE = 'DATA_UPDATE',
  DEPLOYMENT = 'DEPLOYMENT',
  ANOMALY_DETECTED = 'ANOMALY_DETECTED',
  SECURITY_ALERT = 'SECURITY_ALERT',
  AUDIT_LOG = 'AUDIT_LOG',
}
