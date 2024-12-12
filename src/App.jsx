import React, { useState, useEffect, useRef } from 'react';
import Worker2 from './worker2?worker'

function App() {
  const [number, setNumber] = useState(10);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);


  const [inputString, setInputString] = useState('');
  const [reversedString, setReversedString] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  const worker = useRef(null);
  const worker2Ref = useRef(null);

  useEffect(() => {
    worker2Ref.current = new Worker2()
    // Écouter les messages du Worker
    worker2Ref.current.onmessage = (e) => {
      setReversedString(e.data);  // Mettre à jour le résultat
      setLoadingText(false);  // Terminer le chargement
    };

    // Nettoyer le Worker lorsqu'on quitte le composant
    return () => {
      worker2Ref.current.termianate();
    };
  }, []);

  useEffect(() => {
    worker.current = new Worker(new URL('./worker.js', import.meta.url));
    // Dès que le composant est monté, on écoute les messages du Worker
    worker.current.onmessage = (e) => {
      setResult(e.data);  // Mettre à jour le résultat
      setLoading(false);  // Terminer le chargement
    };

    return () => {
      console.log("terminate worker")
      worker.current.terminate();  // Nettoyer le Worker lorsque le composant est démonté
    };
  }, []);
  

  // Simuler un timer pour montrer que l'interface est bloquée pendant le calcul
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleReverseString = () => {
    setLoadingText(true);
    setReversedString('');
    worker2Ref.current.postMessage({ type: 'reverseString', string: inputString });
  };


  // Fonction pour démarrer le calcul Fibonacci
  const calculateFibonacci = () => {
    setLoading(true);
    setResult(null); // Réinitialiser le résultat
    setTimer(0); // Réinitialiser le timer
    worker.current.postMessage({ type: 'calculateFibonacci', number });  // Envoyer un message au Worker
  };

  // Fonction de calcul de la suite de Fibonacci sans Web Worker (exécutée sur le thread principal)
  const calculateFibonacciMainThread = (n) => {
    console.log("calculateFibonacciMainThread : ", n)
    if (n <= 1) return n;
    return calculateFibonacciMainThread(n - 1) + calculateFibonacciMainThread(n - 2);
  };

  const handleCalculateFibonacci = () => {
    setResult(null);
    setTimer(0); 
    // Calcul effectué directement sur le thread principal, ce qui bloque l'UI
    const res = calculateFibonacciMainThread(number);
    setResult(res);
    setLoading(false);
  };

  return (
    <>
      <div>
      <h1>Fibonacci Calculator (Main Thread)</h1>
      <div>
        <label>
          Enter a number: 
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <button onClick={() => {
          setLoading(true)
          handleCalculateFibonacci()
        }}>Calculate Fibonacci</button>
      </div>
      {loading && (
        <div>
          <p>Calculating...</p>
          <p>UI blocked for {timer} seconds</p> {/* Afficher le temps pendant lequel l'UI est bloquée */}
        </div>
      )}
      {result !== null && !loading && <p>Fibonacci result: {result}</p>}
    </div>
    <div>
      <h1>Fibonacci Calculator using Web Worker</h1>
      <div>
        <label>
          Enter a number: 
          <input 
            type="number" 
            value={number} 
            onChange={(e) => setNumber(Number(e.target.value))} 
          />
        </label>
      </div>
      <div>
        <button onClick={calculateFibonacci}>Calculate Fibonacci</button>
      </div>
      {loading && (
        <div>
          <p>Calculating...</p>
          <p>UI NOT blocked for {timer} seconds</p> {/* Afficher le temps pendant lequel l'UI est bloquée */}
        </div>
      )}
      {result !== null && !loading && <p>Fibonacci result: {result}</p>}
    </div>
    <div>
      <h1>String Reversal with Web Worker</h1>
      <div>
        <label>
          Enter a string: 
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleReverseString}>Reverse String</button>
      </div>
      {loadingText && <p>Reversing...</p>}
      {reversedString && !loadingText && <p>Reversed String: {reversedString}</p>}
    </div>
    </>
  );
}

export default App;
