# EVERYDAY


## Introduction

EVERYDAY is a local Electron application designed for everyday use cases. Built with Electron, React, TailwindCSS, Webpack, and TypeScript, this offline app offers multiple tools to assist with various tasks. The app's first feature is the Target Allocation Maintenance, which allows users to manage their asset allocation efficiently.

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Testing](#testing)
-   [Dependencies](#dependencies)
-   [Documentation](#documentation)
-   [Contributors](#contributors)
-   [License](#license)
-   [Contact Information](#contact-information)

## Features

-   **Target Allocation Maintenance**: List your assets, set target percentages for each, enter a budget, and get a breakdown of what to buy next to reach your desired allocation.
-   **Net Worth Assessment**: Track net worth over time by creating dated entries with assets and liabilities. Visualize the evolution on a line chart and export it as PNG.
-   **Recurring Purchases**: Log recurring expenses with custom frequencies (daily, weekly, monthly, yearly), organize them with tags and emojis, and see the annualized cost at a glance.

## Installation

To install EVERYDAY, you'll need to have Node.js installed on your system. Follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory and run `npm install` to install all the necessary dependencies.
3. Once the dependencies are installed, you can build the project by running `npm run build`.
4. To start the application, run `npm start`.

### Easy local setup

For easy local setup, follow the bellow commands (tested on MacOS):
1. `npm i`
2. `npm run build`
3. `npm run pack`

## Usage

EVERYDAY is organized around three tools, each accessible from the sidebar.

### Target Allocation Maintenance

Add the assets in your portfolio, set the target percentage for each, then enter a budget and currency. Hit **Compute** to get a chart showing how much of each asset to buy next in order to reach your target allocation.

### Net Worth Assessment

Create timestamped entries listing your assets and liabilities with their estimated values. The app plots a line chart of your net worth over time that you can export as PNG.

### Recurring Purchases

Add recurring expenses with an emoji, a price, a quantity, and a frequency (e.g. every 2 weeks). Tag items to filter and group them. The app calculates the annualized cost of each item and supports 10 currencies.

## Testing

EVERYDAY uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing. Tests are co-located next to the source files they test (`.test.tsx` / `.test.js`).

### Running tests

| Command | Scope |
|---|---|
| `npm test` | All tests |
| `npm run test:watch` | Watch mode (re-runs on file changes) |
| `npm run test:main` | Main process tests only (TAM algorithm) |
| `npm run test:renderer` | All renderer/UI tests |
| `npm run test:tam` | TAM feature only |
| `npm run test:nw` | Net Worth feature only |
| `npm run test:shared` | Shared/wrapper components (Button, Card, Layout, Sidebar, form fields, Context) |

### Adding tests for a new feature

1. Create components in `src/renderer/components/form/<feature>-form/`
2. Add `.test.tsx` files next to each component -- they are automatically picked up
3. Add an npm script: `"test:<feature>": "vitest run --project renderer <feature>-form"`

No Vitest config changes are needed.

## Dependencies

EVERYDAY is built using several key technologies and libraries, including:

-   Electron (v28.1)
-   React (v18.2.0)
-   TailwindCSS (v3.4)
-   Webpack (v5.89)
-   TypeScript (v5.3)

For a full list of dependencies, refer to the `package.json` file's `devDependencies` and `dependencies` sections.

## Documentation

Further documentation detailing the technical aspects and architecture of EVERYDAY will be available [here](documentation/TECHNICAL-README.md).

## Contributors

-   [Malo Le Mestre](https://github.com/MaloLM) (developer and owner of the repo)
-   [El Walid Kadura](https://github.com/wawkadura) (full stack developer)

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

## Contact Information

For any queries or contributions, please contact Malo Le Mestre :

<div style="display:flex;"> 
   <a href="https://portfolio.dopee.io" target="_blank">
      <img src="https://img.shields.io/badge/Portefolio-green?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Portefolio" height=40>
   </a>
   <a href="https://www.linkedin.com/in/malo-le-mestre/" target="_blank">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin" height=40>
   </a>
   <a href="mailto:malo.lm@icloud.com" target="_blank">
      <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=maildotru&logoColor=white" alt="E-mail" height=40>
   </a>
</div>
