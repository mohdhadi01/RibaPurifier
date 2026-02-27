// export interface Transaction {
//     date: string;
//     description: string;
//     amount: number;
//   }
  
//   export function detectRibaTransactions(structuredText: string): Transaction[] {
//     const statementRows = structuredText.split('\n');
//     const foundRiba: Transaction[] = [];
  
//     // Expanded keywords for standard Indian banks
//     const ribaKeywords = [
//       'INT PD', 
//       'INT.PD', 
//       'CREDIT INTEREST', 
//       'CR INT', 
//       'SAVINGS INT', 
//       'INTEREST PAID', 
//       'INTEREST CR',
//       'INTEREST RECEIVED',
//       'SBINT',          
//       'SB INT',         
//       'INT. REC',       
//       'INT CREDIT',
//       'INT CRED',
//       'INT CR',
//       'INT CRD',
//       'INT CRDT',
//       'INT CRDT',
//     ];
  
//     statementRows.forEach(row => {
//       const upperRow = row.toUpperCase();
//       const isInterest = ribaKeywords.some(keyword => upperRow.includes(keyword));
      
//       if (isInterest) { 
//         // 1. Extract the Row's Primary Date
//         // Matches: "13 Feb '26", "13-Feb-2026", "13/02/2026", etc.
//         const dateMatch = row.match(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4}/);
//         const dateStr = dateMatch ? dateMatch[0] : 'Unknown Date';
        
//         // 2. CLEAN THE ROW (The Secret Sauce)
//         let cleanRow = row;
        
//         // Remove the main date
//         if (dateMatch) cleanRow = cleanRow.replace(dateMatch[0], '');
        
//         // Remove secondary descriptive dates (e.g., "Interest for 12-Feb-2026")
//         cleanRow = cleanRow.replace(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}/g, '');
        
//         // Remove Bank Transaction IDs / UTRs (Any continuous number longer than 5 digits)
//         cleanRow = cleanRow.replace(/\b\d{6,}\b/g, '');
        
//         // 3. Extract the remaining valid amounts
//         // Looks for digits, optional commas, and 0, 1, or 2 decimal places
//         const amountRegex = /\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g;
//         const amounts = cleanRow.match(amountRegex);
        
//         let finalAmount = 0;
        
//         if (amounts && amounts.length > 0) {
//           // Filter out stray loose single digits (like a random '2')
//           const validAmounts = amounts.filter(a => !isNaN(parseFloat(a.replace(/,/g, ''))));
  
//           if (validAmounts.length >= 1) {
//             // Because we scrubbed the dates and IDs, the first number remaining 
//             // in the sentence is ALWAYS the transaction amount. 
//             // (The second number, if present, is the account balance).
//             const amountStr = validAmounts[0].replace(/,/g, ''); 
//             finalAmount = parseFloat(amountStr);
//           }
//         }
        
//         // 4. Save to Ledger
//         if (finalAmount > 0) {
//           foundRiba.push({
//             date: dateStr,
//             description: 'Interest Credit Detected',
//             amount: finalAmount
//           });
//         }
//       }
//     });
  
//     return foundRiba;
//   }

export interface Transaction {
  date: string;
  description: string;
  amount: number;
}

// 1. Isolated helper to safely extract data from any single line
function extractDataFromRow(row: string): { date: string | null, amount: number } {
  // Extract primary date
  const dateMatch = row.match(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4}/);
  const dateStr = dateMatch ? dateMatch[0] : null;
  
  // Clean the row to isolate the money
  let cleanRow = row;
  if (dateMatch) cleanRow = cleanRow.replace(dateMatch[0], ''); // Remove main date
  cleanRow = cleanRow.replace(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}/g, ''); // Remove secondary descriptive dates
  cleanRow = cleanRow.replace(/\b\d{6,}\b/g, ''); // Remove long Bank IDs/UTRs
  
  // Extract remaining amounts
  const amountRegex = /\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g;
  const amounts = cleanRow.match(amountRegex);
  
  let amount = 0;
  if (amounts && amounts.length > 0) {
    // Filter out random single digits left behind (like "Chq: 0")
    const validAmounts = amounts.filter(a => !isNaN(parseFloat(a.replace(/,/g, ''))));
    if (validAmounts.length >= 1) {
      amount = parseFloat(validAmounts[0].replace(/,/g, ''));
    }
  }
  
  return { date: dateStr, amount };
}

export function detectRibaTransactions(structuredText: string): Transaction[] {
  const statementRows = structuredText.split('\n');
  const foundRiba: Transaction[] = [];
  
  // Keep track of rows we already combined so we don't count them twice
  const processedIndexes = new Set<number>(); 

  const ribaKeywords = [
    'INT PD', 'INT.PD', 'CREDIT INTEREST', 'CR INT', 'SAVINGS INT', 
    'INTEREST PAID', 'INTEREST CR', 'INTEREST RECEIVED', 'SBINT', 
    'SB INT', 'INT. REC', 'INT CREDIT'
  ];

  // Using a standard for-loop so we can safely track the index (i)
  for (let i = 0; i < statementRows.length; i++) {
    // Skip if this line was already absorbed by a multi-line transaction
    if (processedIndexes.has(i)) continue; 

    const row = statementRows[i];
    const upperRow = row.toUpperCase();
    const isInterest = ribaKeywords.some(keyword => upperRow.includes(keyword));
    
    if (isInterest) { 
      let { date: finalDate, amount: finalAmount } = extractDataFromRow(row);
      let foundAmount = finalAmount > 0;

      // 2. THE DYNAMIC LOOKAHEAD: Scan up to 3 lines DOWN for the amount
      if (!foundAmount) {
          for (let j = 1; j <= 3; j++) {
              if (i + j < statementRows.length) {
                  const nextData = extractDataFromRow(statementRows[i + j]);
                  if (nextData.amount > 0) {
                      finalAmount = nextData.amount;
                      if (!finalDate) finalDate = nextData.date;
                      processedIndexes.add(i + j); // Mark this line as used!
                      foundAmount = true;
                      break; // Stop looking once we find the money
                  }
              }
          }
      }

      // 3. THE DYNAMIC LOOKBEHIND: Scan up to 2 lines UP just in case (inverted formats)
      if (!foundAmount) {
          for (let j = 1; j <= 2; j++) {
              if (i - j >= 0 && !processedIndexes.has(i - j)) {
                  const prevData = extractDataFromRow(statementRows[i - j]);
                  if (prevData.amount > 0) {
                      finalAmount = prevData.amount;
                      if (!finalDate) finalDate = prevData.date;
                      processedIndexes.add(i - j); // Mark this line as used!
                      foundAmount = true;
                      break;
                  }
              }
          }
      }
      
      // 4. Save to Ledger
      if (foundAmount && finalAmount > 0) {
        foundRiba.push({
          date: finalDate || 'Unknown Date',
          description: 'Interest Credit Detected',
          amount: finalAmount
        });
      }
    }
  }

  return foundRiba;
}

export function countTotalTransactions(structuredText: string): number {
  const statementRows = structuredText.split('\n');
  let count = 0;

  for (const row of statementRows) {
    const isTransaction = /\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4}/.test(row);
    
    if (isTransaction) {
      count++;
    }
  }
  
  return count;
}