import React, { createContext, useContext, useState, ReactNode } from 'react';
import { extractStructuredTextFromPDF } from '../utils/pdfExtractor';
import { countTotalTransactions, detectRibaTransactions, Transaction } from '../utils/ribaDetector';

interface ParserContextType {
  results: Transaction[];
  totalScanned: number;
  setResults: React.Dispatch<React.SetStateAction<Transaction[]>>;
  parsing: boolean;
  passwordRequired: boolean;
  passwordError: string | null;
  rawText: string | null;
  parseFile: (file: File) => Promise<void>;
  submitPassword: (password: string) => Promise<void>;
  cancelPassword: () => void;
}

const ParserContext = createContext<ParserContextType | undefined>(undefined);

export function ParserProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Transaction[]>([]);
  const [totalScanned, setTotalScanned] = useState<number>(0);
  const [parsing, setParsing] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const processDocument = async (file: File, password?: string) => {
    setParsing(true);
    setPasswordError(null);
    
    try {
      const structuredText = await extractStructuredTextFromPDF(file, password);
      setRawText(structuredText); 
      
      const identifiedTransactions = detectRibaTransactions(structuredText);
      const scannedCount = countTotalTransactions(structuredText);

      setResults(identifiedTransactions);
      setTotalScanned(scannedCount);
      setPasswordRequired(false);
      setCurrentFile(null); 
    } catch (err: any) {
      console.error('Context PDF Error:', err);
      if (err?.name === 'PasswordException' || /password/i.test(err?.message || '')) {
        setPasswordRequired(true);
        setCurrentFile(file); 
        if (password) setPasswordError('Incorrect password. Please try again.');
      } else {
        alert(`Failed to parse statement: ${err?.message}`);
      }
    } finally {
      setParsing(false);
    }
  };

  const parseFile = async (file: File) => {
    await processDocument(file);
  };

  const submitPassword = async (password: string) => {
    if (currentFile) await processDocument(currentFile, password);
  };

  const cancelPassword = () => {
    setPasswordRequired(false);
    setPasswordError(null);
    setCurrentFile(null);
  };

  return (
    <ParserContext.Provider value={{
      results, setResults, parsing, passwordRequired, passwordError, rawText, totalScanned,
      parseFile, submitPassword, cancelPassword
    }}>
      {children}
    </ParserContext.Provider>
  );
}

export const useParser = () => {
  const context = useContext(ParserContext);
  if (context === undefined) throw new Error('useParser must be used within a ParserProvider');
  return context;
};