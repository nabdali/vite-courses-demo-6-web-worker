// worker.js
onmessage = function (e) {
    const { type, number } = e.data;
  
    if (type === 'calculateFibonacci') {
      const result = calculateFibonacci(number);
      postMessage(result);  // Envoyer le résultat au thread principal
    }
  };
  
  function calculateFibonacci(n) {
    console.log("calculateFibonacci in worker : ", n)
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
  }
  