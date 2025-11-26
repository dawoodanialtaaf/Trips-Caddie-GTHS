
import { TripRecap, QuoteRequestLog, SmtpConfig, Task } from '../types';

// STORAGE KEYS
const RECAPS_KEY = 'gths_recaps';
const LOGS_KEY = 'gths_logs';
const TASKS_KEY = 'gths_tasks';
const EMAILS_KEY = 'gths_admin_emails';
const SMTP_KEY = 'gths_smtp_config';

// --- RECAPS ---

export const getRecaps = async (): Promise<TripRecap[]> => {
  try {
    const data = localStorage.getItem(RECAPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading recaps from LocalStorage", e);
    return [];
  }
};

export const saveRecap = async (recap: TripRecap): Promise<boolean> => {
  try {
    const recaps = await getRecaps();
    const index = recaps.findIndex(r => r.id === recap.id);
    
    if (index >= 0) {
      recaps[index] = recap;
    } else {
      // Add to top
      recaps.unshift(recap);
    }
    
    localStorage.setItem(RECAPS_KEY, JSON.stringify(recaps));
    return true;
  } catch (e) {
    console.error("Error saving recap", e);
    return false;
  }
};

export const saveRecaps = async (recaps: TripRecap[]): Promise<boolean> => {
  try {
    localStorage.setItem(RECAPS_KEY, JSON.stringify(recaps));
    return true;
  } catch (e) {
    return false;
  }
};

export const deleteRecap = async (id: string): Promise<boolean> => {
  try {
    const recaps = await getRecaps();
    const updated = recaps.filter(r => r.id !== id);
    localStorage.setItem(RECAPS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error("Error deleting recap", e);
    return false;
  }
};

// --- LOGS ---

export const getLogs = async (): Promise<QuoteRequestLog[]> => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveLog = async (log: QuoteRequestLog): Promise<boolean> => {
  try {
    const logs = await getLogs();
    logs.unshift(log);
    // Keep last 50
    const trimmed = logs.slice(0, 50);
    localStorage.setItem(LOGS_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    return false;
  }
};

export const saveLogs = async (logs: QuoteRequestLog[]): Promise<void> => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const deleteLog = async (id: string): Promise<boolean> => {
  try {
    const logs = await getLogs();
    const updated = logs.filter(l => l.id !== id);
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
};

export const updateLogStatus = async (id: string, status: string): Promise<boolean> => {
  return true; // Not strictly implemented in local version yet
};

// --- TASKS ---

export const getTasks = async (): Promise<Task[]> => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
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
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch (e) {
    return false;
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const tasks = await getTasks();
    const updated = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
};

// --- CONFIG ---

export const getAdminEmails = async (): Promise<string[] | null> => {
  try {
    const data = localStorage.getItem(EMAILS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveAdminEmails = async (emails: string[]): Promise<boolean> => {
  localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
  return true;
};

export const getSmtpConfig = async (): Promise<SmtpConfig | null> => {
  try {
    const data = localStorage.getItem(SMTP_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveSmtpConfig = async (config: SmtpConfig): Promise<boolean> => {
  localStorage.setItem(SMTP_KEY, JSON.stringify(config));
  return true;
};

// --- IMPORT / EXPORT ---

export const exportDatabase = async () => {
  try {
    const data = {
      recaps: await getRecaps(),
      logs: await getLogs(),
      tasks: await getTasks(),
      adminEmails: await getAdminEmails(),
      smtp: await getSmtpConfig(),
      timestamp: new Date().toISOString(),
      version: 'localStorage-backup'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CaddieArchive_Backup_${new Date().toISOString().split('T')[0]}.json`;
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
        
        // Restore to LocalStorage
        if (json.recaps) localStorage.setItem(RECAPS_KEY, JSON.stringify(json.recaps));
        if (json.logs) localStorage.setItem(LOGS_KEY, JSON.stringify(json.logs));
        if (json.tasks) localStorage.setItem(TASKS_KEY, JSON.stringify(json.tasks));
        if (json.adminEmails) localStorage.setItem(EMAILS_KEY, JSON.stringify(json.adminEmails));
        if (json.smtp) localStorage.setItem(SMTP_KEY, JSON.stringify(json.smtp));
        
        resolve(true);
      } catch (err) {
        console.error("Import failed", err);
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
