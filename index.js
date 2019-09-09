const twitter = require('twitter');
const posTagger = require('wink-pos-tagger');

// Retrieve tweets with "thanks" or "bless you" in the tweet body.
// Perform part-of-speech (POS) tagging to find plural noun phrases (NNS) near "thanks" or "bless you"
// Create a word blend (portmanteau) of the plural noun phrase and "thanks" or "bless you"
// Draft a tweet of the word blend so a human can manually observe and approve/reject it later.