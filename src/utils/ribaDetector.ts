export interface Transaction {
    date: string;
    description: string;
    amount: number;
  }
  
  export function detectRibaTransactions(structuredText: string): Transaction[] {
    const statementRows = structuredText.split('\n');
    const foundRiba: Transaction[] = [];
  
    // Expanded keywords for standard Indian banks
    const ribaKeywords = [
      'INT PD', 
      'INT.PD', 
      'CREDIT INTEREST', 
      'CR INT', 
      'SAVINGS INT', 
      'INTEREST PAID', 
      'INTEREST CR',
      'INTEREST RECEIVED'
    ];
  
    statementRows.forEach(row => {
      const upperRow = row.toUpperCase();
      const isInterest = ribaKeywords.some(keyword => upperRow.includes(keyword));
      
      if (isInterest) { 
        // 1. Extract the Row's Primary Date
        // Matches: "13 Feb '26", "13-Feb-2026", "13/02/2026", etc.
        const dateMatch = row.match(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}|\d{2}[-/]\d{2}[-/]\d{4}/);
        const dateStr = dateMatch ? dateMatch[0] : 'Unknown Date';
        
        // 2. CLEAN THE ROW (The Secret Sauce)
        let cleanRow = row;
        
        // Remove the main date
        if (dateMatch) cleanRow = cleanRow.replace(dateMatch[0], '');
        
        // Remove secondary descriptive dates (e.g., "Interest for 12-Feb-2026")
        cleanRow = cleanRow.replace(/\d{2}[-\s/][a-zA-Z]{3}[-\s/]\'?\d{2,4}/g, '');
        
        // Remove Bank Transaction IDs / UTRs (Any continuous number longer than 5 digits)
        cleanRow = cleanRow.replace(/\b\d{6,}\b/g, '');
        
        // 3. Extract the remaining valid amounts
        // Looks for digits, optional commas, and 0, 1, or 2 decimal places
        const amountRegex = /\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/g;
        const amounts = cleanRow.match(amountRegex);
        
        let finalAmount = 0;
        
        if (amounts && amounts.length > 0) {
          // Filter out stray loose single digits (like a random '2')
          const validAmounts = amounts.filter(a => !isNaN(parseFloat(a.replace(/,/g, ''))));
  
          if (validAmounts.length >= 1) {
            // Because we scrubbed the dates and IDs, the first number remaining 
            // in the sentence is ALWAYS the transaction amount. 
            // (The second number, if present, is the account balance).
            const amountStr = validAmounts[0].replace(/,/g, ''); 
            finalAmount = parseFloat(amountStr);
          }
        }
        
        // 4. Save to Ledger
        if (finalAmount > 0) {
          foundRiba.push({
            date: dateStr,
            description: 'Interest Credit Detected',
            amount: finalAmount
          });
        }
      }
    });
  
    return foundRiba;
  }