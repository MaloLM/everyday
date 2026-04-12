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

    return { sendRequestData, sendWriteData, onResponseData, saveFormData, loadNetWorthData, saveNetWorthEntry, deleteNetWorthEntry, loadRpData, saveRpItem, deleteRpItem }
}
