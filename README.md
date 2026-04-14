# EVERYDAY


## Introduction

EVERYDAY is a local Electron application designed for everyday use cases. Built with Electron, React, TailwindCSS, Webpack, and TypeScript, this offline app offers multiple tools to assist with personal finance management, meal planning, and more. All data stays on your machine.

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
-   **Net Worth Assessment**: Track net worth over time by creating dated entries with assets and liabilities. Visualize the evolution on a line chart, view asset allocation as a treemap, and export charts as PNG.
-   **Recurring Purchases**: Log recurring expenses with custom frequencies (daily, weekly, monthly, yearly), organize them with tags and emojis, and see the annualized cost at a glance.
-   **Recipes**: A personal cookbook to store recipes with ingredients, tools, preparation costs, and markdown instructions with live preview.
-   **Budgeting**: Plan monthly budgets by listing incomes (with deduction rates) and expenses. Filter by tags and visualize the breakdown with charts.
-   **Savings Projects**: Define savings goals with a target amount, starting value, and monthly contribution. Track progress over time in a month-by-month table.
-   **Home & Backup**: A central dashboard with quick access to every tool, plus full data import/export for local backups.
-   **Privacy Blur**: A global toggle to blur all financial amounts across the app.
-   **Draggable Sidebar**: Reorder navigation items via drag-and-drop; the order is persisted locally.

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

EVERYDAY is organized around six tools plus a home dashboard, each accessible from the sidebar. The sidebar order can be customized via drag-and-drop.

### Home

The landing page provides quick-access cards to every tool and lets you **export** all local data as a JSON backup or **import** a previously exported backup.

### Target Allocation Maintenance

Add the assets in your portfolio, set the target percentage for each, then enter a budget and currency. Hit **Compute** to get a chart showing how much of each asset to buy next in order to reach your target allocation.

### Net Worth Assessment

Create timestamped entries listing your assets and liabilities with their estimated values. Optionally set a yield percentage per asset. The app plots a line chart of your net worth over time and an asset allocation treemap, both exportable as PNG.

### Recurring Purchases

Add recurring expenses with an emoji, a price, a quantity, and a frequency (e.g. every 2 weeks). Tag items to filter and group them. The app calculates the annualized cost of each item and supports 10 currencies.

### Recipes

Store your recipes with a list of ingredients (name, quantity, unit), required tools, estimated preparation cost, and markdown-formatted instructions with live preview. Browse all recipes in a searchable list.

### Budgeting

Create a monthly budget by listing incomes (with an optional deduction rate for taxes/contributions) and expenses. Tag items for filtering, and view the breakdown through interactive charts.

### Savings Projects

Define one or more savings goals with a target amount, starting value, and planned monthly contribution. A month-by-month table shows projected progress toward each goal.

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
| `npm run test:coverage` | All tests with coverage report |

### Adding tests for a new feature

1. Create components in `src/renderer/components/form/<feature>-form/`
2. Add `.test.tsx` files next to each component -- they are automatically picked up
3. Add an npm script: `"test:<feature>": "vitest run --project renderer <feature>-form"`

No Vitest config changes are needed.

## Dependencies

EVERYDAY is built using several key technologies and libraries, including:

-   Electron (v39)
-   React (v18.2)
-   TailwindCSS (v3.4)
-   Webpack (v5.89)
-   TypeScript (v5.3)
-   Chart.js (v4.4) & react-chartjs-2
-   Formik & Yup (form state & validation)
-   react-markdown & remark-gfm (markdown rendering)
-   date-fns (date utilities)
-   Vitest & React Testing Library (testing)

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
