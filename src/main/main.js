const { app, BrowserWindow, ipcMain, session } = require("electron");
const { readJsonFile, writeJsonFile } = require("./services/dataFiles");
const path = require("path");
const {
  run_tam_optimization,
} = require("./services/targetAllocationMaintenance");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 640,
    minHeight: 720,
    backgroundColor: '#0B0B0B',
    icon: path.join(__dirname, 'icons/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.bundle.js')
    },
  });

  // open DevTools automatically
  // win.webContents.openDevTools();

  const isDev = !app.isPackaged;
  if (isDev) {
    // Relax CSP in dev to allow webpack-dev-server HMR (WebSocket + inline scripts)
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' ws://localhost:8080; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'"
          ],
        },
      });
    });
    win.loadURL('http://localhost:8080');
  } else {
    win.loadFile(path.join(__dirname, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  };
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  };
});

app.whenReady().then(createWindow);

// ---------------------------------------------------------------------------
// IPC helpers
// ---------------------------------------------------------------------------

/**
 * Registers load / save (upsert) / delete handlers for a JSON-backed collection.
 */
function registerCrudHandlers({ prefix, filename, collectionKey, saveChannel, deleteChannel }) {
  ipcMain.handle(`${prefix}:load`, async () => {
    return await readJsonFile(filename);
  });

  ipcMain.handle(`${prefix}:${saveChannel}`, async (_, item) => {
    let data = await readJsonFile(filename);
    if (!data[collectionKey]) data = { ...data, [collectionKey]: [] };

    const idx = data[collectionKey].findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      data[collectionKey][idx] = item;
    } else {
      data[collectionKey].push(item);
    }

    await writeJsonFile(filename, data);
    return data;
  });

  ipcMain.handle(`${prefix}:${deleteChannel}`, async (_, itemId) => {
    let data = await readJsonFile(filename);
    if (!data[collectionKey]) data = { ...data, [collectionKey]: [] };

    data[collectionKey] = data[collectionKey].filter((i) => i.id !== itemId);
    await writeJsonFile(filename, data);
    return data;
  });
}

// ---------------------------------------------------------------------------
// IPC communications
// ---------------------------------------------------------------------------

// TAM handlers (legacy on/send pattern kept for backward compat)
ipcMain.handle("write-data-channel", async (event, data) => {
  let res = run_tam_optimization(data);
  return { status: "tam-result", message: res };
});

ipcMain.on("update-tam-config", (event, data) => {
  writeJsonFile("tam_form_data.json", data);
});

ipcMain.on("request-data-channel", async (event) => {
  try {
    const data = await readJsonFile("tam_form_data.json");
    event.sender.send("response-data-channel", data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    event.sender.send("response-data-channel", {
      error: "Failed to read JSON file",
    });
  }
});

// Collection CRUD handlers
const NW_FILE = "net_worth_data.json";
const RP_FILE = "recurring_purchases_data.json";
const RECIPES_FILE = "recipes_data.json";
const EA_FILE = "expense_analysis_data.json";

registerCrudHandlers({ prefix: "nw", filename: NW_FILE, collectionKey: "entries", saveChannel: "save-entry", deleteChannel: "delete-entry" });
registerCrudHandlers({ prefix: "rp", filename: RP_FILE, collectionKey: "items", saveChannel: "save-item", deleteChannel: "delete-item" });
registerCrudHandlers({ prefix: "recipes", filename: RECIPES_FILE, collectionKey: "recipes", saveChannel: "save", deleteChannel: "delete" });
registerCrudHandlers({ prefix: "ea", filename: EA_FILE, collectionKey: "imports", saveChannel: "save-import", deleteChannel: "delete-import" });

const GI_FILE = "gift_ideas_data.json";
registerCrudHandlers({ prefix: "gi", filename: GI_FILE, collectionKey: "ideas", saveChannel: "save", deleteChannel: "delete" });

// Budget (simple save, no upsert/delete)
const BUDGET_FILE = "budget_data.json";

ipcMain.handle("budget:load", async () => {
  return await readJsonFile(BUDGET_FILE);
});

ipcMain.handle("budget:save", async (event, data) => {
  await writeJsonFile(BUDGET_FILE, data);
  return data;
});

// Savings Projects (simple save, no upsert/delete)
const SP_FILE = "savings_projects_data.json";

ipcMain.handle("sp:load", async () => {
  return await readJsonFile(SP_FILE);
});

ipcMain.handle("sp:save", async (event, data) => {
  await writeJsonFile(SP_FILE, data);
  return data;
});

// EA bulk save (full data overwrite for tag sync)
ipcMain.handle("ea:save", async (event, data) => {
  await writeJsonFile(EA_FILE, data);
  return data;
});

// Export all data
ipcMain.handle("app:export-all", async () => {
  const [tam, netWorth, recurringPurchases, recipes, budget, savingsProjects, expenseAnalysis, giftIdeas] = await Promise.all([
    readJsonFile("tam_form_data.json"),
    readJsonFile(NW_FILE),
    readJsonFile(RP_FILE),
    readJsonFile(RECIPES_FILE),
    readJsonFile(BUDGET_FILE),
    readJsonFile(SP_FILE),
    readJsonFile(EA_FILE),
    readJsonFile(GI_FILE),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    tam,
    netWorth,
    recurringPurchases,
    recipes,
    budget,
    savingsProjects,
    expenseAnalysis,
    giftIdeas,
  };
});

ipcMain.handle("app:import-all", async (event, data) => {
  await Promise.all([
    writeJsonFile("tam_form_data.json", data.tam ?? {}),
    writeJsonFile(NW_FILE, data.netWorth ?? {}),
    writeJsonFile(RP_FILE, data.recurringPurchases ?? {}),
    writeJsonFile(RECIPES_FILE, data.recipes ?? {}),
    writeJsonFile(BUDGET_FILE, data.budget ?? {}),
    writeJsonFile(SP_FILE, data.savingsProjects ?? {}),
    writeJsonFile(EA_FILE, data.expenseAnalysis ?? {}),
    writeJsonFile(GI_FILE, data.giftIdeas ?? {}),
  ]);
});
