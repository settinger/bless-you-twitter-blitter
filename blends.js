// Word blend function and tools

const isConsonant = (letter) => {
  return [...'bcdfghjklmnpqrstvwxz'].includes(letter);
}
const isVowel = (letter) => {
  return [...'aeiou'].includes(letter);
}
const isLiquid = (letter) => {
  return [...'wlr'].includes(letter);
}

const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1);
}

const blender = (prefixer, inWord) => {
  let word = inWord.toLowerCase();
  let prefix = prefixer.slice(0,2).toLowerCase();
  
  // Case 1: word starts with vowels; return prefix+word
  if (isVowel(word[0])) {
    return prefix + word;
  }

  // Case 2: word starts with a 'y' that's definitely a vowel
  if (word[0]==='y' && isConsonant(word[1])) {
    // return prefix+word
    return prefix + word;
  }

  // Case 3: word starts with a 'y' that's definitely a consonant
  if (word[0]==='y' && isVowel(word[1])) {
    // return prefix + headless word
    return prefix + word.slice(1);
  }
  

  let firstVowelIndex = [...word].findIndex((letter) => isVowel(letter))
  let initialCluster = word.slice(0, firstVowelIndex);
  if (word[firstVowelIndex-1] === 'q' && word[firstVowelIndex] === 'u') {
    firstVowelIndex++;
    initialCluster += 'u';
  }
  // If 'y' in initial consonant cluster: too complicated, give up
  if ([...initialCluster].includes('y')) {
    return -1;
  }

  // Case 4: prefix is "bless you", word starts with consonant cluster
  if (prefix === 'bl') {
    return prefix + word.slice(firstVowelIndex);
  }

  // Case 5a: prefix is "thanks", word starts with consonant cluster (not liquid-final)
  if (!isLiquid(word[firstVowelIndex-1])) {
    return prefix + word.slice(firstVowelIndex);s
  }
  // Case 5b: prefix is "thanks", word starts with consonant cluster (liquid-final)
  else {
    return prefix + word.slice(firstVowelIndex-1);
  }

  // else: give up [we should never reach this condition]
  return -10;
}

module.exports = { blender, capitalize };