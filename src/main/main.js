const { app, BrowserWindow, ipcMain } = require("electron");
const { readJsonFile, writeJsonFile } = require("./services/dataFiles");
const path = require("path");
const {
  run_tam_optimization,
} = require("./services/targetAllocationMaintenance");

/**
 * Creates a new browser window with predefined settings.
 * The window is set to 800x600 pixels and has certain web preferences enabled,
 * such as node integration, disabling context isolation, and enabling the remote module.
 * After creating the window, it loads the HTML file from the specified path.
 */

// To return to a build envrionment : 
// - loadFile instead of loadURL: ok  
// - change the index.html : ok
// - contextIsolation to true : ok
// - load the preload file  :  ok
// - change the api/electron.js in renderer : ok
function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 720,
    minWidth: 640,
    minHeight: 720,
    icon: path.join(__dirname, 'icons/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.bundle.js')
    },
  });

  // open DevTools automatically
  // win.webContents.openDevTools();

  // Open main winder
  win.loadFile( path.join(__dirname, "index.html"));
  // win.loadURL('http://localhost:8080');

}

/**
 * Event listener for the 'window-all-closed' event of the app.
 * This event is triggered when all windows of the application have been closed.
 *
 * On platforms other than 'darwin' (macOS), this will quit the application.
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  };
});

/**
 * Event listener for the 'activate' event of the app.
 * This event typically occurs when the application is activated from the dock or taskbar.
 *
 * If there are no open windows when the application is activated, it creates a new window.
 */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  };
});

app.whenReady().then(createWindow);

// IPC communications -----------------------------

/**
 * Listens for the 'write-data-channel' event on ipcMain.
 * This event is triggered to write data to a JSON file and run an optimization process.
 *
 * @param {Event} event - The event object from Electron's ipcMain.
 * @param {Object} data - The data received from the renderer process.
 */
ipcMain.handle("write-data-channel", async (event, data) => {
  let res = run_tam_optimization(data);
  return { status: "tam-result", message: res };
});

/**
 * Event listener for 'update-tam-config'.
 * Listens for the 'update-tam-config' event and writes the provided data to 'tam_form
_data.json'.
*

@param {Event} event - The event object provided by ipcMain.
@param {Object} data - The data to be written to 'tam_form_data.json'. This object contains the configuration data that needs to be updated.
*/
ipcMain.on("update-tam-config", (event, data) => {
  writeJsonFile("tam_form_data.json", data);
});
/**
 * Listens for the 'request-data-channel' event on ipcMain.
 * This event is triggered to read data from a JSON file and send it back to the renderer process.
 *
 * @param {Event} event - The event object from Electron's ipcMain.
 */
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
