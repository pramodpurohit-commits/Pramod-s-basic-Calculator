
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/Button';
import { Calculation, Operation } from './types';
import { solveMathProblem } from './services/geminiService';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<Calculation[]>([]);
  
  // AI Assistant States
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const handleOperator = useCallback((nextOp: Operation) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const result = performCalculation();
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
    setEquation(`${inputValue} ${nextOp}`);
  }, [display, operation, prevValue]);

  const performCalculation = () => {
    const current = parseFloat(display);
    const prev = prevValue || 0;
    let result = 0;

    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current !== 0 ? prev / current : 0; break;
      default: return current;
    }

    const newCalc: Calculation = {
      equation: `${prev} ${operation} ${current} =`,
      result: String(result),
      timestamp: Date.now()
    };
    setHistory(prevHistory => [newCalc, ...prevHistory.slice(0, 9)]);
    return result;
  };

  const handleEqual = () => {
    if (!operation || prevValue === null) return;
    
    const result = performCalculation();
    setDisplay(String(result));
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handleAiSolve = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const result = await solveMathProblem(aiInput);
    setAiResult(result);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#0f172a] text-slate-200">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Traditional Calculator */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h1 className="ml-2 text-lg font-semibold tracking-tight text-slate-400">LuminaCalc Standard</h1>
          </div>

          <div className="glass rounded-[2rem] p-6 shadow-2xl overflow-hidden flex flex-col h-full">
            {/* Display Area */}
            <div className="flex flex-col items-end justify-end h-32 mb-6">
              <div className="text-slate-500 text-sm mono mb-1 truncate w-full text-right h-5">
                {equation}
              </div>
              <div className="text-5xl md:text-6xl font-light mono tracking-tighter text-white truncate w-full text-right">
                {display}
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-3">
              <Button label="AC" variant="action" onClick={handleClear} />
              <Button label="+/-" variant="action" onClick={handleSign} />
              <Button label="%" variant="action" onClick={handlePercent} />
              <Button label="÷" variant="operator" onClick={() => handleOperator('/')} />

              <Button label="7" onClick={() => handleDigit('7')} />
              <Button label="8" onClick={() => handleDigit('8')} />
              <Button label="9" onClick={() => handleDigit('9')} />
              <Button label="×" variant="operator" onClick={() => handleOperator('*')} />

              <Button label="4" onClick={() => handleDigit('4')} />
              <Button label="5" onClick={() => handleDigit('5')} />
              <Button label="6" onClick={() => handleDigit('6')} />
              <Button label="-" variant="operator" onClick={() => handleOperator('-')} />

              <Button label="1" onClick={() => handleDigit('1')} />
              <Button label="2" onClick={() => handleDigit('2')} />
              <Button label="3" onClick={() => handleDigit('3')} />
              <Button label="+" variant="operator" onClick={() => handleOperator('+')} />

              <Button label="0" className="col-span-2" onClick={() => handleDigit('0')} />
              <Button label="." onClick={() => handleDigit('.')} />
              <Button label="=" variant="equal" onClick={handleEqual} />
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant and History */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
          
          {/* AI Assistant Section */}
          <div className="glass rounded-[2rem] p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Smart Assistant</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask me to solve a word problem or explain a math concept..."
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all resize-none h-32"
                />
                <button
                  onClick={handleAiSolve}
                  disabled={isAiLoading || !aiInput.trim()}
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-2 rounded-xl transition-colors flex items-center space-x-2"
                >
                  {isAiLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Solve</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {aiResult && (
                <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                  <p className="text-blue-200 leading-relaxed whitespace-pre-wrap">{aiResult}</p>
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="glass rounded-[2rem] p-8 flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Calculation History</h2>
              </div>
              <button 
                onClick={() => setHistory([])}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider font-semibold"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500 space-y-2 opacity-50">
                   <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Your history is empty</p>
                </div>
              ) : (
                history.map((calc) => (
                  <div 
                    key={calc.timestamp} 
                    className="flex flex-col items-end border-b border-slate-700/30 pb-3 last:border-0 group cursor-pointer hover:bg-slate-800/20 p-2 rounded-xl transition-all"
                    onClick={() => {
                      setDisplay(calc.result);
                      setWaitingForOperand(true);
                    }}
                  >
                    <span className="text-slate-500 text-sm mono group-hover:text-slate-400">{calc.equation}</span>
                    <span className="text-xl font-medium text-blue-400 mono">{calc.result}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <footer className="mt-12 text-slate-500 text-sm flex items-center space-x-4">
        <span>&copy; 2024 LuminaCalc AI</span>
        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
        <span>Built with Google Gemini</span>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default App;
