npx depcheck
Unused devDependencies
* autoprefixer
* webpack-cli

--------------------------


 █▀▄ █▀▀ ▄▀█ █▀▄   █▀▀ █▀█ █▀▄ █▀▀   █▀▀ █ █ █▀▀ █▀▀ █▄▀ █▀▀ █▀█
 █▄▀ ██▄ █▀█ █▄▀   █▄▄ █▄█ █▄▀ ██▄   █▄▄ █▀█ ██▄ █▄▄ █ █ ██▄ █▀▄


🔍 Analyzing codebase...
 █████████████████████████ | 100% | 100/100 | 📁 Collecting files 
 █████████████████████████ | 100% | 40/40 | 📖 Reading files 📄 src/type.d.ts
 █████████████████████████ | 100% | 40/40 | 🔍 Processing declarations 📄 src/type.d.ts
 █████████████████████████ | 100% | 40/40 | ⚡ Analyzing usage 📄 src/type.d.ts


✨ Dead Code Analysis Summary
📊 Found 96 unused declarations in 32 files

📈 Statistics:
  • Functions: 47 unused
  • Variables: 15 unused
  • External imports: 21 unused
  • Other: 13 unused
  • Files affected: 32
  • Estimated lines saved: ~768

🔍 Detailed Results:

📁 src/main/main.js (4 items):
  📦 const/let/var path:3
  🔹 other createWindow:16
  🔹 other win:17
  🔹 other res:59

📁 src/main/services/dataFiles.js (8 items):
  📦 const/let/var path:1
  📦 const/let/var fs:2
  🔹 other getDataFilePath:7
  ⚡ function userDataPath:8
  🔹 other readJsonFile:12
  🔹 other filePath:14
  ⚡ function jsonData:27
  ⚡ function writeJsonFile:41

📁 src/main/services/targetAllocationMaintenance.js (10 items):
  🔹 other run_tam_optimization:3
  🔹 other totalValue:4
  🔹 other budget:5
  ⚡ function adjustments:8
  🔹 other updateAndSortAssets:19
  🔹 other assetsByNeed:30
  🔹 other madePurchase:34
  ⚡ function quantityToBuy:38
  ⚡ function adjustment:42
  🔹 other asset:61

📁 src/renderer/App.tsx (2 items):
  📥 import HashRouter (imported but not used)
  📥 import React (imported but not used)

📁 src/renderer/api/electron.tsx (3 items):
  ⚡ function sendRequestData:2
  ⚡ function sendWriteData:6
  ⚡ function saveFormData:14

📁 src/renderer/components/BarChart.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function BarChart:15

📁 src/renderer/components/Button.tsx (1 items):
  ⚡ function Button:13

📁 src/renderer/components/DonutChart.tsx (3 items):
  📥 import React (imported but not used)
  📥 import Chart (imported but not used)
  ⚡ function DonutChart:11

📁 src/renderer/components/HelpButton.tsx (1 items):
  📥 import React (imported but not used)

📁 src/renderer/components/Layout.tsx (1 items):
  ⚡ function Layout:8

📁 src/renderer/components/Sidebar.tsx (4 items):
  ⚡ function Sidebar:5
  📦 const/let/var navigate:7
  ⚡ function toggleSidebar:9
  ⚡ function navigateToPath:13

📁 src/renderer/components/form/NumberField.tsx (2 items):
  ⚡ function NumberField:13
  📦 const/let/var value:27

📁 src/renderer/components/form/SelectorField.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function SelectorField:11

📁 src/renderer/components/form/SliderField.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function SliderField:14

📁 src/renderer/components/form/TextField.tsx (1 items):
  ⚡ function TextField:12

📁 src/renderer/components/form/tam-form/AssetForm.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function AssetForm:13

📁 src/renderer/components/form/tam-form/AssetList.tsx (6 items):
  ⚡ function setFieldValue:15
  📦 const/let/var MAX_ASSETS:18
  ⚡ function AssetList:20
  📦 const/let/var lastAssetRef:21
  ⚡ function newAssets:36
  ⚡ function AddAsset:62

📁 src/renderer/components/form/tam-form/BudgetCurrencyForm.tsx (3 items):
  📥 import React (imported but not used)
  ⚡ function handleUpdate:10
  ⚡ function BudgetCurrencyForm:13

📁 src/renderer/components/form/tam-form/TamBarChart.tsx (3 items):
  📥 import React (imported but not used)
  ⚡ function onCompute:9
  ⚡ function TamBarChart:13

📁 src/renderer/components/form/tam-form/TamDonutChart.tsx (2 items):
  📥 import Chart (imported but not used)
  ⚡ function TamDonutChart:14

📁 src/renderer/components/form/tam-form/TamForm.tsx (9 items):
  ⚡ function onSubmit:15
  📦 const/let/var formRef:21
  ⚡ function handleUpdate:29
  ⚡ function updateChart:37
  ⚡ function targetData:41
  ⚡ function currentData:42
  ⚡ function scrollTo:123
  ⚡ function processErrors:131
  📦 const/let/var errorMessagesSet:134

📁 src/renderer/components/utils/CustomToaster.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function CustomToaster:5

📁 src/renderer/components/utils/ErrorMessage.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function ErrorMessages:4

📁 src/renderer/components/utils/Loading.tsx (1 items):
  📥 import React (imported but not used)

📁 src/renderer/context/AppContext.tsx (6 items):
  ⚡ function setTamData:8
  📦 const/let/var AppContext:11
  ⚡ function AppProvider:16
  ⚡ function handleResponse:21
  📦 const/let/var cleanup:30
  📦 const/let/var contextValue:35

📁 src/renderer/index.tsx (1 items):
  📥 import React (imported but not used)

📁 src/renderer/pages/NotFound.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function NotFoundComponent:3

📁 src/renderer/pages/OtherFeature.tsx (2 items):
  📥 import React (imported but not used)
  ⚡ function OtherFeature:4

📁 src/renderer/pages/TargetAllocationMaintenance.tsx (1 items):
  ⚡ function TargetAllocationMaintenance:8

📁 src/renderer/utils/constants.tsx (4 items):
  📥 import ChartData (imported but not found)
  📥 import TamFormData (imported but not found)
  📦 const/let/var MOCK_CHART_DATA:19
  📦 const/let/var CURRENCIES:39

📁 src/renderer/utils/form-validation.tsx (1 items):
  📦 const/let/var TamFormSchema:13

📁 src/renderer/utils/parse.tsx (3 items):
  📥 import TamFormResponse (imported but not found)
  ⚡ function parseTamFormData:4
  ⚡ function parseToChartData:27

💡 Tip: Remove these unused declarations to improve code quality and reduce bundle size.