import * as XLSX from "xlsx";
const getLocalTimeISO = (): string => {
    const now = new Date();

    // Extract the local time components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
}
const getFileName = (name: string) => {
    let timeSpan = getLocalTimeISO();
    let sheetName = name || "ExportResult";
    let fileName = `${sheetName}-${timeSpan}`;
    return {
        sheetName,
        fileName
    };
};
export class TableUtil {
    static exportTableToExcel(tableId: string, name?: string) {
        let { sheetName, fileName } = getFileName(name);
        let targetTableElm = document.getElementById(tableId);
        let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
            sheet: sheetName
        });
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }

    static exportArrayToExcel(arr: any[], name?: string) {
        let { sheetName, fileName } = getFileName(name);

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(arr);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
}
