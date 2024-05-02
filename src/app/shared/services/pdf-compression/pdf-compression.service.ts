import { Injectable } from '@angular/core';
import { PDFDocument, PDFName, PDFPage } from 'pdf-lib';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class PdfCompressionService {

  constructor() { }

  async compressPDF(file: File) {

    const fileBytes = await file.arrayBuffer();
    // Serialize the modified PDF document
    const pdfDoc = await PDFDocument.load(fileBytes);

    const pdfBytes = await pdfDoc.save();
    const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
    const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
    pdfUint8Array.set(pdfBytes);

    const compressedBytes = pako.gzip(pdfUint8Array);

    return compressedBytes;
  }


}
