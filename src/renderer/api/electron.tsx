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

    return { sendRequestData, sendWriteData, onResponseData, saveFormData }
}
