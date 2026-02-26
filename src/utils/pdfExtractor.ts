import * as pdfjsLib from 'pdfjs-dist';

// Dynamically link the worker to prevent Vite hanging
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    
    // Extract text with coordinates
    const textItems = content.items.map((item: any) => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5]
    }));

    // Group by Y-Coordinate (Row)
    const rows: { [y: string]: typeof textItems } = {};
    const Y_TOLERANCE = 3; 

    textItems.forEach(item => {
      const existingY = Object.keys(rows).find(
        yKey => Math.abs(parseFloat(yKey) - item.y) <= Y_TOLERANCE
      );
      if (existingY) {
        rows[existingY].push(item);
      } else {
        rows[item.y] = [item];
      }
    });

    const sortedY = Object.keys(rows).sort((a, b) => parseFloat(b) - parseFloat(a));

    sortedY.forEach(y => {
      const rowItems = rows[y];
      rowItems.sort((a, b) => a.x - b.x); 
      const rowString = rowItems.map(item => item.str.trim()).filter(Boolean).join('  ');
      if (rowString) fullStructuredText += rowString + "\n";
    });
    
    fullStructuredText += "\n---PAGE BREAK---\n";
  }
  
  return fullStructuredText;
}