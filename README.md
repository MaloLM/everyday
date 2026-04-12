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

-   **Target Allocation Maintenance**: Allows users to list all types of assets they possess, specify the desired percentage each asset should represent in their portfolio, input their budget, and then computes how much of each asset the user should buy next to achieve the desired distribution.
-   **Net Worth Assessment**: Track and visualize net worth evolution over time. Create audit entries with assets and liabilities, view a line chart of net worth history, and export charts as PNG.
-   **Other Features**: More features could be added in the future.

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

The EVERYDAY app features a user-friendly interface with various tools. Its first feature is the Target Allocation Maintenance tool. Here's how to use it:

1. **Current Allocation**: Upon launching the app, you're greeted with the 'Current Allocation' section. This is where you'll add and review the assets in your portfolio. For each asset, you can input the amount you own and adjust the desired target percentage of your total portfolio that you wish for that asset to represent.

    ![Current Allocation](documentation/images/current_allocation.png)

2. **Budget Input and Currency Selection**: Navigate to the 'Next Buy Estimation' section. Here, you'll find a budget input field where you can enter the amount of money you're planning to invest. You can also select the currency of your budget from the dropdown menu.

    ![Budget Input](documentation/images/next_buy_estimation.png)

3. **Computation and Results**: After filling in your budget and currency, click the 'Compute' button. The app will then process your data and present you with a 'Next Buy Estimation' chart. This chart visualizes the amount of each asset you should buy next to align with your target allocation, based on your specified budget.

    ![Next Buy Estimation](documentation/images/compute_result.png)

By following these steps, you can efficiently manage your asset portfolio to match your investment goals and preferences. This tool simplifies the decision-making process by providing clear visual aids and personalized data based on your strategy.

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
