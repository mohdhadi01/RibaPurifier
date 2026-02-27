// import * as pdfjsLib from 'pdfjs-dist';

// // Dynamically link the worker to prevent Vite hanging
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// export async function extractStructuredTextFromPDF(file: File, password?: string): Promise<string> {
//   const arrayBuffer = await file.arrayBuffer();
//   const uint8Array = new Uint8Array(arrayBuffer); 

//   const loadingTask = pdfjsLib.getDocument({ 
//     data: uint8Array, 
//     password: password 
//   });
  
//   const pdf = await loadingTask.promise;
//   let fullStructuredText = "";
  
//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const content = await page.getTextContent();
    
//     // Extract text with coordinates
//     const textItems = content.items.map((item: any) => ({
//       str: item.str,
//       x: item.transform[4],
//       y: item.transform[5]
//     }));

//     // Group by Y-Coordinate (Row)
//     const rows: { [y: string]: typeof textItems } = {};
//     const Y_TOLERANCE = 3; 

//     textItems.forEach(item => {
//       const existingY = Object.keys(rows).find(
//         yKey => Math.abs(parseFloat(yKey) - item.y) <= Y_TOLERANCE
//       );
//       if (existingY) {
//         rows[existingY].push(item);
//       } else {
//         rows[item.y] = [item];
//       }
//     });

//     const sortedY = Object.keys(rows).sort((a, b) => parseFloat(b) - parseFloat(a));

//     sortedY.forEach(y => {
//       const rowItems = rows[y];
//       rowItems.sort((a, b) => a.x - b.x); 
//       const rowString = rowItems.map(item => item.str.trim()).filter(Boolean).join('  ');
//       if (rowString) fullStructuredText += rowString + "\n";
//     });
    
//     fullStructuredText += "\n---PAGE BREAK---\n";
//   }
  
//   return fullStructuredText;
// } 

import * as pdfjsLib from 'pdfjs-dist';

// Dynamically link the worker to prevent Vite hanging
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
}

export async function extractStructuredTextFromPDF(file: File, password?: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    password: password
  });

  const pdf = await loadingTask.promise;
  let fullStructuredText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // --- FIX 1: Extract text with width so we can detect column gaps ---
    const textItems: TextItem[] = content.items.map((item: any) => ({
      str: item.str,
      x: Math.round(item.transform[4]),
      y: Math.round(item.transform[5]),
      width: Math.round(item.width ?? 0),
    }));

    // --- FIX 2: Wider Y tolerance (5pt) handles slight baseline shifts in
    //            multi-column tables (e.g. Canara Bank's wrapped particulars) ---
    const Y_TOLERANCE = 5;

    const rows: { yKey: number; items: TextItem[] }[] = [];

    for (const item of textItems) {
      if (!item.str.trim()) continue;

      const existing = rows.find(r => Math.abs(r.yKey - item.y) <= Y_TOLERANCE);
      if (existing) {
        existing.items.push(item);
      } else {
        rows.push({ yKey: item.y, items: [item] });
      }
    }

    // Sort rows top-to-bottom (higher Y = higher on page in PDF coords)
    rows.sort((a, b) => b.yKey - a.yKey);

    for (const row of rows) {
      // Sort items left-to-right
      row.items.sort((a, b) => a.x - b.x);

      // --- FIX 3: Insert a TAB between items that have a large X gap
      //            (gap > 15pt indicates a new column), otherwise a single space ---
      const parts: string[] = [];
      for (let i = 0; i < row.items.length; i++) {
        const item = row.items[i];
        if (i === 0) {
          parts.push(item.str.trim());
        } else {
          const prev = row.items[i - 1];
          const prevEnd = prev.x + (prev.width || 0);
          const gap = item.x - prevEnd;
          // Gap > 15pt → treat as column separator (TAB), else single space
          const separator = gap > 15 ? '\t' : ' ';
          parts.push(separator + item.str.trim());
        }
      }

      const rowString = parts.join('').trim();
      if (rowString) fullStructuredText += rowString + "\n";
    }

    fullStructuredText += "\n---PAGE BREAK---\n";
  }

  return fullStructuredText;
}