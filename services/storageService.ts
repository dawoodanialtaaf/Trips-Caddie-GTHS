
import { TripRecap, QuoteRequestLog, SmtpConfig, Task } from '../types';
import { MOCK_RECAPS } from '../constants';

const STORAGE_KEYS = {
  RECAPS: 'gths_recaps',
  LOGS: 'gths_request_logs',
  TASKS: 'gths_tasks',
  ADMIN_EMAILS: 'gths_admin_emails',
  SMTP_CONFIG: 'gths_smtp_config'
};

// Helper to simulate async behavior for API compatibility
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- RECAPS ---

export const getRecaps = async (): Promise<TripRecap[]> => {
  await delay(100); // Simulate network
  const stored = localStorage.getItem(STORAGE_KEYS.RECAPS);
  if (!stored) {
      // Initialize with Mocks if empty
      localStorage.setItem(STORAGE_KEYS.RECAPS, JSON.stringify(MOCK_RECAPS));
      return MOCK_RECAPS;
  }
  return JSON.parse(stored);
};

export const saveRecap = async (recap: TripRecap): Promise<boolean> => {
  try {
    const recaps = await getRecaps();
    const index = recaps.findIndex(r => r.id === recap.id);
    
    if (index >= 0) {
        recaps[index] = recap;
    } else {
        recaps.unshift(recap);
    }
    
    localStorage.setItem(STORAGE_KEYS.RECAPS, JSON.stringify(recaps));
    return true;
  } catch (e) {
    console.error("Error saving recap", e);
    return false;
  }
};

export const deleteRecap = async (id: string): Promise<boolean> => {
  try {
    const recaps = await getRecaps();
    const filtered = recaps.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECAPS, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
};

// Deprecated bulk save
export const saveRecaps = async (recaps: TripRecap[]): Promise<boolean> => {
    localStorage.setItem(STORAGE_KEYS.RECAPS, JSON.stringify(recaps));
    return true;
};

// --- LOGS ---

export const getLogs = async (): Promise<QuoteRequestLog[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
  return stored ? JSON.parse(stored) : [];
};

export const saveLog = async (log: QuoteRequestLog): Promise<boolean> => {
  try {
      const logs = await getLogs();
      const updated = [log, ...logs].slice(0, 50); // Keep last 50
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
      return true;
  } catch (e) {
      return false;
  }
};

export const deleteLog = async (id: string): Promise<boolean> => {
    try {
        const logs = await getLogs();
        const updated = logs.filter(l => l.id !== id);
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
        return true;
    } catch (e) {
        return false;
    }
};

export const saveLogs = async (logs: QuoteRequestLog[]) => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

export const updateLogStatus = async (id: string, status: string): Promise<boolean> => {
    return true; // Placeholder
};

// --- TASKS ---

export const getTasks = async (): Promise<Task[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTask = async (task: Task): Promise<boolean> => {
    try {
        const tasks = await getTasks();
        const index = tasks.findIndex(t => t.id === task.id);
        if (index >= 0) {
            tasks[index] = task;
        } else {
            tasks.unshift(task);
        }
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        return true;
    } catch (e) {
        return false;
    }
};

export const deleteTask = async (id: string): Promise<boolean> => {
    try {
        const tasks = await getTasks();
        const updated = tasks.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
        return true;
    } catch (e) {
        return false;
    }
};

export const saveTasks = async (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

// --- CONFIG ---

export const getAdminEmails = async (): Promise<string[] | null> => {
  const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_EMAILS);
  return stored ? JSON.parse(stored) : null;
};

export const saveAdminEmails = async (emails: string[]): Promise<boolean> => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_EMAILS, JSON.stringify(emails));
  return true;
};

export const getSmtpConfig = async (): Promise<SmtpConfig | null> => {
  const stored = localStorage.getItem(STORAGE_KEYS.SMTP_CONFIG);
  return stored ? JSON.parse(stored) : null;
};

export const saveSmtpConfig = async (config: SmtpConfig): Promise<boolean> => {
  localStorage.setItem(STORAGE_KEYS.SMTP_CONFIG, JSON.stringify(config));
  return true;
};

// --- BACKUP & RESTORE ---

export const exportDatabase = async () => {
  try {
    const data = {
      recaps: await getRecaps(),
      logs: await getLogs(),
      tasks: await getTasks(),
      adminEmails: await getAdminEmails(),
      smtp: await getSmtpConfig(),
      timestamp: new Date().toISOString(),
      version: 'local-storage-v1'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CaddieArchive_LocalBackup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error("Error exporting database", e);
    alert("Failed to export database");
  }
};

export const importDatabase = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        if (json.recaps) await saveRecaps(json.recaps);
        if (json.logs) await saveLogs(json.logs);
        if (json.tasks) await saveTasks(json.tasks);
        if (json.adminEmails) await saveAdminEmails(json.adminEmails);
        if (json.smtp) await saveSmtpConfig(json.smtp);
        
        resolve(true);
      } catch (err) {
        console.error("Import failed", err);
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
