import { TripRecap, QuoteRequestLog, SmtpConfig, Task } from '../types';

const API_BASE_URL = 'https://golfthehighsierra.com/trips-caddie/api';

// --- Core Data Access ---

export const getRecaps = async (): Promise<TripRecap[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-recaps.php?t=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (e) {
    console.error("Error loading recaps", e);
    return [];
  }
};

export const saveRecaps = async (recaps: TripRecap[]): Promise<boolean> => {
  console.warn('saveRecaps is deprecated, use saveRecap');
  return true;
};

export const saveRecap = async (recap: TripRecap): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-recaps.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recap)
    });
    if (!response.ok) throw new Error('Failed to save');
    return true;
  } catch (e) {
    console.error("Error saving recap", e);
    return false;
  }
};

export const deleteRecap = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-recaps.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete');
    return true;
  } catch (e) {
    console.error("Error deleting recap", e);
    return false;
  }
};

// --- Logs ---

export const getLogs = async (): Promise<QuoteRequestLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-logs.php?t=${Date.now()}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (e) {
    console.error("Error loading logs", e);
    return [];
  }
};

export const saveLogs = async (logs: QuoteRequestLog[]): Promise<void> => {
  console.warn('saveLogs is deprecated');
};

export const saveLog = async (log: QuoteRequestLog): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-logs.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    if (!response.ok) throw new Error('Failed to save');
    return true;
  } catch (e) {
    console.error("Error saving log", e);
    return false;
  }
};

export const updateLogStatus = async (id: string, status: string): Promise<boolean> => {
  return true;
};

export const deleteLog = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-logs.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete');
    return true;
  } catch (e) {
    console.error("Error deleting log", e);
    return false;
  }
};

// --- Tasks (Stubbed) ---

export const getTasks = async (): Promise<Task[]> => {
  return [];
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {};

export const saveTask = async (task: Task): Promise<boolean> => {
  return true;
};

export const deleteTask = async (id: string): Promise<boolean> => {
  return true;
};

// --- Config (Stubbed) ---

export const getAdminEmails = async (): Promise<string[] | null> => {
  return null;
};

export const saveAdminEmails = async (emails: string[]): Promise<boolean> => {
  return true;
};

export const getSmtpConfig = async (): Promise<SmtpConfig | null> => {
  return null;
};

export const saveSmtpConfig = async (config: SmtpConfig): Promise<boolean> => {
  return true;
};

// --- Backup & Restore ---

export const exportDatabase = async () => {
  try {
    const data = {
      recaps: await getRecaps(),
      logs: await getLogs(),
      tasks: await getTasks(),
      adminEmails: await getAdminEmails(),
      smtp: await getSmtpConfig(),
      timestamp: new Date().toISOString(),
      version: '2.0'
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
        
        if (!json.recaps || !Array.isArray(json.recaps)) {
          throw new Error("Invalid backup file format");
        }

        for (const recap of json.recaps) {
          await saveRecap(recap);
        }

        if (json.logs && Array.isArray(json.logs)) {
          for (const log of json.logs) {
            await saveLog(log);
          }
        }
        
        resolve(true);
      } catch (err) {
        console.error("Import failed", err);
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};