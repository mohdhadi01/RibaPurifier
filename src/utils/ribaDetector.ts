

// export interface Transaction {
//   date: string;
//   description: string;
//   amount: number;
// }

// // 1. Isolated helper to safely extract data from any single line
// function extractDataFromRow(row: string): { date: string | null, amount: number } {
//   // Extract primary date (Handles "31 Mar 2025", "28-03-2025", "03 Feb '26")
//   const dateMatch = row.match(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4}/);
//   const dateStr = dateMatch ? dateMatch[0] : null;
  
//   // Clean the row to isolate the money
//   let cleanRow = row;
//   if (dateMatch) cleanRow = cleanRow.replace(dateMatch[0], ''); 
//   cleanRow = cleanRow.replace(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}/g, ''); // Scrub secondary dates
//   cleanRow = cleanRow.replace(/\b\d{5,}\b/g, ''); // Scrub long Bank IDs/UTRs
  
//   // THE SILVER BULLET: Extract amounts strictly requiring a decimal point (.XX)
//   // This completely ignores serial numbers (like "358"), years ("2025"), etc.
//   const amountRegex = /\d{1,3}(?:,\d{3})*\.\d{1,2}|\d+\.\d{1,2}/g;
//   const amounts = cleanRow.match(amountRegex);
  
//   let amount = 0;
//   if (amounts && amounts.length > 0) {
//     // The first decimal number remaining is universally the Transaction Amount.
//     // (The second one is the running balance, which we ignore here).
//     const cleanAmountStr = amounts[0].replace(/,/g, '');
//     amount = parseFloat(cleanAmountStr);
//   }
  
//   return { date: dateStr, amount };
// }

// export function detectRibaTransactions(structuredText: string): Transaction[] {
//   const statementRows = structuredText.split('\n');
//   const foundRiba: Transaction[] = [];
  
//   // Keep track of rows we already combined so we don't count them twice
//   const processedIndexes = new Set<number>(); 

//   // Comprehensive dictionary covering SBI, HDFC, ICICI, Canara, Paytm, Axis
//   const ribaKeywords = [
//     'INT PD', 'INT.PD', 'CREDIT INTEREST', 'CR INT', 'SAVINGS INT', 
//     'INTEREST PAID', 'INTEREST CR', 'INTEREST RECEIVED', 'SBINT', 
//     'SB INT', 'INT. REC', 'INT CREDIT', 'INT CRED', 'INT CRD', 'INT CRDT'
//   ];

//   for (let i = 0; i < statementRows.length; i++) {
//     // Skip if this line was already absorbed by a multi-line transaction
//     if (processedIndexes.has(i)) continue; 

//     const row = statementRows[i];
//     const upperRow = row.toUpperCase();
//     const isInterest = ribaKeywords.some(keyword => upperRow.includes(keyword));
    
//     if (isInterest) { 
//       let { date: finalDate, amount: finalAmount } = extractDataFromRow(row);
//       let foundAmount = finalAmount > 0;

//       // DYNAMIC LOOKAHEAD: If Canara Bank pushes the money 2 lines down, find it!
//       if (!foundAmount) {
//           for (let j = 1; j <= 3; j++) {
//               if (i + j < statementRows.length) {
//                   const nextData = extractDataFromRow(statementRows[i + j]);
//                   if (nextData.amount > 0) {
//                       finalAmount = nextData.amount;
//                       if (!finalDate) finalDate = nextData.date;
//                       processedIndexes.add(i + j); // Mark line as used
//                       foundAmount = true;
//                       break; 
//                   }
//               }
//           }
//       }

//       // DYNAMIC LOOKBEHIND: In case of inverted PDF table formats
//       if (!foundAmount) {
//           for (let j = 1; j <= 2; j++) {
//               if (i - j >= 0 && !processedIndexes.has(i - j)) {
//                   const prevData = extractDataFromRow(statementRows[i - j]);
//                   if (prevData.amount > 0) {
//                       finalAmount = prevData.amount;
//                       if (!finalDate) finalDate = prevData.date;
//                       processedIndexes.add(i - j); 
//                       foundAmount = true;
//                       break;
//                   }
//               }
//           }
//       }
      
//       // Save to Ledger
//       if (foundAmount && finalAmount > 0) {
//         foundRiba.push({
//           date: finalDate || 'Unknown Date',
//           description: 'Interest Credit Detected',
//           amount: finalAmount
//         });
//       }
//     }
//   }

//   return foundRiba;
// }

// // Ensure the Analysis Summary accurately reflects the amount of data processed
// export function countTotalTransactions(structuredText: string): number {
//   return structuredText.split('\n').filter(row => row.trim().length > 0).length;
// }


export interface Transaction {
  date: string;
  description: string;
  amount: number;
}

// 1. Isolated helper to safely extract data from any single line
function extractDataFromRow(row: string): { date: string | null, amount: number } {

  // const dateMatch = row.match(/^\s*(\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4})/);
  const dateMatch = row.match(/^\s*(?:\d{1,5}\s+[.)\s]*)?(\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4})/);
  const dateStr = dateMatch ? dateMatch[1] : null;
  
  // Clean ALL dates from the row so they don't get accidentally parsed as amounts
  let cleanRow = row.replace(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4}/g, ' '); 
  cleanRow = cleanRow.replace(/\b\d{5,}\b/g, ' '); // Scrub long Bank IDs/UTRs
  
  // Extract amounts strictly requiring a decimal point (.XX)
  const amountRegex = /\d{1,3}(?:,\d{3})*\.\d{1,2}|\d+\.\d{1,2}/g;
  const amounts = cleanRow.match(amountRegex);
  
  let amount = 0;
  if (amounts && amounts.length > 0) {
    // The first decimal number remaining is universally the Transaction Amount.
    const cleanAmountStr = amounts[0].replace(/,/g, '');
    amount = parseFloat(cleanAmountStr);
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
    'SB INT', 'INT. REC', 'INT CREDIT', 'INT CRED', 'INT CRD', 'INT CRDT'
  ];

  for (let i = 0; i < statementRows.length; i++) {
    // Skip if this line was already absorbed by a multi-line transaction
    if (processedIndexes.has(i)) continue; 

    const row = statementRows[i];
    const upperRow = row.toUpperCase();
    const isInterest = ribaKeywords.some(keyword => upperRow.includes(keyword));
    
    if (isInterest) { 
      let { date: finalDate, amount: finalAmount } = extractDataFromRow(row);
      let foundAmount = finalAmount > 0;

      // DYNAMIC LOOKAHEAD
      if (!foundAmount) {
          for (let j = 1; j <= 3; j++) {
              if (i + j < statementRows.length) {
                  const nextData = extractDataFromRow(statementRows[i + j]);
                  if (nextData.amount > 0) {
                      finalAmount = nextData.amount;
                      
                      // FIX 2: If the line with the money has a valid date, ALWAYS prefer it!
                      if (nextData.date) finalDate = nextData.date; 
                      
                      processedIndexes.add(i + j); // Mark line as used
                      foundAmount = true;
                      break; 
                  }
              }
          }
      }

      // DYNAMIC LOOKBEHIND (Crucial for the PNB format you showed)
      if (!foundAmount) {
          for (let j = 1; j <= 2; j++) {
              if (i - j >= 0 && !processedIndexes.has(i - j)) {
                  const prevData = extractDataFromRow(statementRows[i - j]);
                  if (prevData.amount > 0) {
                      finalAmount = prevData.amount;
                      
                      // FIX 3: Prefer the date attached to the money row
                      if (prevData.date) finalDate = prevData.date; 
                      
                      processedIndexes.add(i - j); 
                      foundAmount = true;
                      break;
                  }
              }
          }
      }
      
      // Save to Ledger
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
  return structuredText.split('\n').filter(row => row.trim().length > 0).length;
}