// worker.js
onmessage = function (e) {
    const { type, string } = e.data;
  
    if (type === 'reverseString') {
      const reversedString = reverseString(string);
      postMessage(reversedString); // Envoie la chaîne inversée au thread principal
    }
  };
  
  // Fonction qui inverse une chaîne de caractères
  function reverseString(str) {
    return str.split('').reverse().join('');
  }
  