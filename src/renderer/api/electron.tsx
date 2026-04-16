export function useIpcRenderer() {
    const sendRequestData = () => {
        window.electron.requestData()
    }

    const sendWriteData = (data: any): Promise<any> => {
        return window.electron.sendData(data)
    }

    const onResponseData = (callback: (event: any, data: any) => void): (() => void) => {
        return window.electron.onResponseData(callback)
    }

    const saveFormData = (data: any) => {
        window.electron.saveTAMForm(data)
    }

    const loadNetWorthData = (): Promise<any> => {
        return window.electron.loadNetWorthData()
    }

    const saveNetWorthEntry = (entry: any): Promise<any> => {
        return window.electron.saveNetWorthEntry(entry)
    }

    const deleteNetWorthEntry = (entryId: string): Promise<any> => {
        return window.electron.deleteNetWorthEntry(entryId)
    }

    const loadRpData = (): Promise<any> => {
        return window.electron.loadRpData()
    }

    const saveRpItem = (item: any): Promise<any> => {
        return window.electron.saveRpItem(item)
    }

    const deleteRpItem = (itemId: string): Promise<any> => {
        return window.electron.deleteRpItem(itemId)
    }

    const loadBudgetData = (): Promise<any> => {
        return window.electron.loadBudgetData()
    }

    const saveBudgetData = (data: any): Promise<any> => {
        return window.electron.saveBudgetData(data)
    }

    const loadSavingsProjectsData = (): Promise<any> => {
        return window.electron.loadSavingsProjectsData()
    }

    const saveSavingsProjectsData = (data: any): Promise<any> => {
        return window.electron.saveSavingsProjectsData(data)
    }

    const loadEaData = (): Promise<any> => {
        return window.electron.loadEaData()
    }

    const saveEaData = (data: any): Promise<any> => {
        return window.electron.saveEaData(data)
    }

    const saveEaImport = (importData: any): Promise<any> => {
        return window.electron.saveEaImport(importData)
    }

    const deleteEaImport = (importId: string): Promise<any> => {
        return window.electron.deleteEaImport(importId)
    }

    const loadRecipesData = (): Promise<any> => {
        return window.electron.loadRecipesData()
    }

    const saveRecipe = (recipe: any): Promise<any> => {
        return window.electron.saveRecipe(recipe)
    }

    const deleteRecipe = (recipeId: string): Promise<any> => {
        return window.electron.deleteRecipe(recipeId)
    }

    const exportAllData = (): Promise<any> => {
        return window.electron.exportAllData()
    }

    const importAllData = (data: any): Promise<void> => {
        return window.electron.importAllData(data)
    }

    return { sendRequestData, sendWriteData, onResponseData, saveFormData, loadNetWorthData, saveNetWorthEntry, deleteNetWorthEntry, loadRpData, saveRpItem, deleteRpItem, loadBudgetData, saveBudgetData, loadSavingsProjectsData, saveSavingsProjectsData, loadEaData, saveEaData, saveEaImport, deleteEaImport, loadRecipesData, saveRecipe, deleteRecipe, exportAllData, importAllData }
}
