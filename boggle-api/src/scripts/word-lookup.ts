import fs from 'fs';
import readline from 'readline'

export function wordExists(word: string, language: string, callback: (foundWord: boolean) => void) {
  if (word.length <= 1)  {
    callback(false)
    return false;
  }
  let found = false;

  let wordlist = "src/wordlist/nl.txt"
  switch(language.toLowerCase()) {
    case "dutch":
    default:
      wordlist = "src/wordlists/nl.txt";
  }

  const stream = fs.createReadStream(wordlist, "utf8");

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    if (line === word.toLowerCase()) {
      found = true;
      rl.close();
      rl.removeAllListeners();
    }
  });

  rl.on('close', () => {
    callback(found);
    return found;
  });
}