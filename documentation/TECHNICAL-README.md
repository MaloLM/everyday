# EVERYDAY Technical Documentation

## Table of Contents

1. [Overview of the Application Architecture &amp; Configuration](#overview-of-the-application-architecture--configuration)
    - [Codebase Structure](#codebase-structure)
    - [Configuration Files](#configuration-files)
2. [Dependencies and Libraries](#dependencies-and-libraries)
3. [Setup Development Mode](#setup-development-mode)
4. [Packaging &amp; Deployment](#packaging--deployment)
5. [Security](#security)
    - [Content Security Policy](#content-security-policy)
6. [New Feature Workflow](#new-feature-workflow)
    - [Main Process](#main-process)
    - [Renderer Process](#renderer-process)
7. [External Resources](#external-resources)

## Overview of the Application Architecture & Configuration

The EVERYDAY app leverages the Electron framework, which allows for a separation of concerns between the backend logic ('main' process) and the rendering logic ('renderer' process).

### Codebase Structure

-   `src`: The source directory containing all the application code.
    -   `data`: Stores data files used by the application, such as `tam_form_data.json`, which could contain form data for the Target Allocation Maintenance feature.
    -   `main`: Contains the backend logic of the Electron app.
        -   `main.js`: The entry point for the Electron main process.
        -   `preload.js`: Script that can safely run before the renderer process is loaded.
        -   `services`: Contains backend services.
    -   `renderer`: Contains the rendering logic for the Electron app.
        -   `App.tsx`: The main React component that wraps the entire renderer process UI.
        -   `api`: Contains API-related code, possibly for communicating between the renderer and main processes.
        -   `assets`: Static assets like images, logos, etc.
        -   `components`: Reusable React components.
        -   `context`: React Contexts for state management across the application.
        -   `pages`: React components that represent entire pages or routes in the application.
        -   `styles`: Contains global CSS files for styling the application.
        -   `utils`: Utility functions and types for the application.

### Configuration Files

The application is configured using several files:

-   `package.json`: Lists all the dependencies and scripts needed for the project.
-   `package-lock.json`: Provides version information for all packages installed which ensures that the same version of a package is used on all environments.
-   `tsconfig.main.json` and `tsconfig.renderer.json`: Configuration files for TypeScript compilation in the main and renderer processes respectively.
-   `webpack.main.config.js` and `webpack.renderer.config.js`: Define the configuration for Webpack to bundle the main and renderer process code.
-   `.gitignore`: Specifies intentionally untracked files to ignore by Git.
-   `.prettierrc`: Configuration for Prettier, an opinionated code formatter, ensuring code style consistency.
-   `postcss.config.js`: Configuration for PostCSS, a tool for transforming CSS with JavaScript plugins.
-   `tailwind.config.js`: Configuration for TailwindCSS, a utility-first CSS framework.
-   `public/index.html`: The main HTML file that serves as the entry point to the renderer process.

## Dependencies and Libraries

The app is built using a variety of dependencies listed in the project's `package.json` file. Here is the list of key dependencies and development dependencies:

-   **Main Dependencies**:

    -   `chart.js`: Charting library used for visualizations like the pie and bar charts.
    -   `formik`: Library to manage form state in React.
    -   `fs`: Filesystem module to interact with the file system.
    -   `lucide-react`: React icons library.
    -   `path`: Utility module to handle file paths.
    -   `react-chartjs-2`: React wrapper for `chart.js`.
    -   `react-hot-toast`: Library for creating toast notifications.
    -   `react-router-dom`: DOM bindings for React Router.
    -   `yup`: Schema builder for value parsing and validation.

-   **Development Dependencies**:

    -   Babel and TypeScript-related packages for compiling JavaScript and TypeScript.
    -   Electron and Webpack for bundling and running the Electron application.
    -   TailwindCSS and PostCSS for styling.
    -   Various loaders and plugins for handling different file types in the Webpack build process.

## Setup Development Mode

To optimize the development environment for efficiency, such as enabling hot reload, certain modifications are necessary:

-   In `main.js`:

    -   Disable `contextIsolation` and remove `preload` in `new BrowserWindow` parameters:

        ```jsx
        contextIsolation: false
        // preload: path.join(__dirname, 'preload.bundle.js')
        ```

    -   Load from localhost during development instead of the `index.html` file:

        ```jsx
        // win.loadFile("index.html");
        win.loadURL('http://localhost:8080')
        ```

    -   Optionally, open the developer tools by default:

        ```jsx
        win.webContents.openDevTools()
        ```

-   In `public/index.html`:

    -   Disable the `Content-Security-Policy` meta tag, by adding 'unsafe-eval' in the script-src parameter of content attribute:

        ```html
        <meta
            http-equiv="Content-Security-Policy"
            content="
                        default-src 'none';
                        script-src 'self' 'unsafe-eval'; <--- this
                        connect-src 'self';
                        img-src 'self' data:;
                        style-src 'self' 'unsafe-inline';
                        font-src 'self';
                        object-src 'none';
                    "
        />
        ```

-   In `renderer/api/electron.tsx`:

    If `preload` and `contextIsolation` were previously set, the `ipcRenderer` cannot be used directly. It is necessary to call functions defined in `preload.js`:

    -   Original code using `ipcRenderer` directly:

        ```jsx
        import { ipcRenderer } from 'electron'

        export function useIpcRenderer() {
            const sendRequestData = () => {
                ipcRenderer.send('request-data-channel')
            }
            ....
        }
        ```

    -   Modified code calling functions from `preload.js`:

        ```jsx
        export function useIpcRenderer() {
            const sendRequestData = () => {
                window.electron.requestData()
            }
            ....
        }
        ```

-   In `./webpack.renderer.config.js` & `./webpack.main.config.js` (OPTIONAL: for better quicker launch):

    -   Set `mode` to `development`:

        ```jsx
        module.exports = {
            mode: 'development',
            ...
        }
        ```

Make sure to revert these changes when preparing the application for production to ensure security and proper file path resolution.

## Packaging & Deployment

When you're ready to build the EVERYDAY app for production, certain parameters in the `package.json` file under the `build` property determine how the application is packaged for different operating systems:

-   `appId`: The unique identifier for your app, usually in reverse domain notation. For this app, it is set as `"io.dopee.everyday"`.
-   `productName`: The name of the product as it should appear in the installer and on the computer. For this app, it is `"Everyday"`.
-   `directories`: Defines where the output of the build process should be placed. Here, it is set to the `"dist_packaged"` directory.
-   `files`: Specifies which files and directories are included in the build. This typically includes the `dist` folder, `node_modules`, and `package.json`.
-   `win`: Configuration specific to Windows builds.
    -   `target`: The type of the installer, set to `"nsis"` for a Windows installer.
    -   `icon`: The path to the application icon file for Windows, set to `"dist/icons/logo.ico"`.
-   `mac`: Configuration specific to macOS builds.
    -   `target`: The type of the distribution, set to `"dmg"` for a macOS disk image.
    -   `icon`: The path to the application icon file for macOS, set to `"dist/icons/logo.icns"`.
-   `linux`: Configuration specific to Linux builds.
    -   `target`: The type of the distribution, set to `"AppImage"` which is a common Linux package format.
    -   `icon`: The path to the application icon file for Linux, set to `"dist/icons/logo.png"`.

The `package.json` also defines scripts to package the application:

-   `"pack": "electron-builder --dir --mac"`: This command packages the app for macOS without creating an installer. The application is packaged in a directory (useful for testing the packaged app without installing it).
-   `"dist": "electron-builder --win --mac --linux"`: Creates installers for all target operating systems (Windows, macOS, and Linux).
-   `"dist:mac"`: Creates an installer for macOS only (`.dmg`).
-   `"dist:win"`: Creates an installer for Windows only (`nsis`).
-   `"dist:linux"`: Creates an installer for Linux only (`AppImage`).

To package the app, you must follow these steps:

1. Run `npm install` to ensure all node modules are installed.
2. Execute `npm run build` to create the `dist` folder with all the files bundled for production.
3. Choose one of the following:
    - Run `npm run pack` if you need to package the app for macOS in a directory format for testing purposes.
    - Run `npm run dist` to create installers for all target operating systems.
    - Run `npm run dist:mac`, `npm run dist:win`, or `npm run dist:linux` to create an installer for a single platform.

> Tip: you can also pass platform flags directly to the default script, e.g. `npm run dist -- --mac` — but the dedicated scripts above are preferred as they don't inherit the `--win --mac --linux` flags from the `dist` script.

The `pack` script is typically used for generating a testable build without generating an installer, while `dist` is used for creating the final distribution installers that end-users would download and install.

## Security

For security within the Electron framework, the following practices are generally recommended and should be implemented:

-   Use of `contextIsolation` in the Electron renderer process to ensure that preload scripts run in a separate context from the page.
-   Enable `nodeIntegration` and `enableRemoteModule` only if absolutely necessary and understand the security implications of doing so.
-   Sanitize any data that is being sent from and to the renderer process to prevent code injection attacks.

For more details on Electron's security recommendations, it is advised to refer to the official Electron security documentation.

### Content Security Policy

In the `index.html` file, a critical security feature implemented is the Content Security Policy (CSP), which is defined by the following `meta` element:

```html
<meta
    http-equiv="Content-Security-Policy"
    content=" 	default-src 'none';
                script-src 'self';
                connect-src 'self';
                img-src 'self' data:;
                style-src 'self' 'unsafe-inline';
                font-src 'self';
                object-src 'none';"
/>
```

This CSP meta tag serves several important security purposes:

-   **default-src 'none';**: This is the default policy for loading content such as JavaScript, Images, CSS, Fonts, AJAX requests, Frames, HTML5 Media. By setting it to 'none', it restricts all content sources by default, which means the page won’t load any content unless explicitly allowed by other CSP rules.
-   **script-src 'self';**: Allows the execution of scripts only from the current origin (`'self'`). This means only scripts that are part of your application can be executed, significantly reducing the risk of XSS (Cross-Site Scripting) attacks.
-   **connect-src 'self';**: Restricts the URLs which can be loaded using script interfaces. Setting this to `'self'` only allows connections (AJAX requests, WebSockets) to the same origin as the application. This helps prevent data exfiltration to untrusted sources.
-   **img-src 'self' data:;**: Defines which images can be displayed on your application. `'self'` allows images from the same origin, and `data:` allows images to be included directly in the document using a data URI.
-   **style-src 'self' 'unsafe-inline';**: Specifies where styles can be loaded from. `'self'` allows only styles from the same origin. `'unsafe-inline'` permits the use of inline styles, which can be necessary for some applications but is less secure as it allows the execution of inline scripts.
-   **font-src 'self';**: Controls which font resources can be loaded. Only fonts from the same origin are allowed.
-   **object-src 'none';**: Prevents the application from loading plugins (like Flash or Java applets), which can be a security risk.

By defining a strict CSP, the application mitigates the risk of content injection vulnerabilities, including XSS attacks, which are a common threat to web applications.

## New Feature Workflow

To add a new feature to the EVERYDAY app, follow these steps which cover changes across both the main and renderer processes:

### Main Process

1. **Function Implementation**: Implement the necessary functions within the `main` logic. This includes creating new service functions that the feature will require to operate.
2. **Preload Endpoints**: If using a `preload.js` file, define a new endpoint that the renderer process will use to access the new functions in the main process.

### Renderer Process

1. **API Endpoint**: Add the new endpoint function within the `renderer/api/electron.js` file. This should mirror the structure of existing endpoints to maintain consistency.
2. **Function Declaration**: Declare the function signature in the `src/type.d.ts` file to provide TypeScript definitions, which will prevent IDE errors related to undefined functions.
3. **Feature Page**: Create a new page component in the `renderer/pages` directory that will serve as the interface for your new feature. Utilize the newly created API function within this component.
4. **Routing**: Integrate the new page into the application's routing by adding an entry in the `renderer/App.tsx` file. Assign it a route path that reflects the feature name (e.g., `/feature-name`).
5. **Sidebar Link**: Add a new link in the `renderer/components/Sidebar.tsx` for easy navigation to your feature. Ensure consistency with existing links and utilize an appropriate icon from the Lucide Icon Library. Icons can be searched and selected from the [Lucide Icon Library](https://lucide.dev/icons/).
6. **Feature Development**: Develop the feature using existing UI components like `Card`, `Button`, and form `Fields` to ensure a consistent look and feel. For design patterns and component examples, you can reference the [FlowBite Library](https://flowbite.com/docs/getting-started/introduction/). Note that it's not necessary to install FlowBite; it's merely for visual and functional reference.

## External Resources

For developers looking to enhance their understanding or streamline their workflow, the following resources may prove invaluable:

-   Useful GPTs
    -   React + Electron: [GPT React-Electron Guide](https://chat.openai.com/g/g-JlFTNuY6S-react-electron)
    -   Tailwind CSS: [GPT Tailwind CSS Guide](https://chat.openai.com/g/g-SjAqAvLPM-tailwind-css-copilot)
-   Icons
    -   Lucide Icons: [Lucide Icon Library](https://lucide.dev/icons/)
-   Tailwind UI Components
    -   Flowbite: [Flowbite Tailwind UI](https://flowbite.com/docs/getting-started/introduction/)
-   Tailwind Cheat Sheet
    -   Tailwind Components: [Tailwind CSS Cheatsheet](https://tailwindcomponents.com/cheatsheet/)
