// Retrieve tweets with "thanks" or "bless you" in the tweet body
// Perform part-of-speech (POS) tagging to find plural noun phrases (NNS) near "thanks" or "bless you"
// Create a word blend (portmanteau) of the plural noun phrase and "thanks" or "bless you"
// Draft a tweet of the word blend so a human can manually observe and approve/reject it later

require('dotenv').config();
const twitter = require('twitter');
const posTagger = require('wink-pos-tagger');

const { blender, capitalize } = require('./blends');
const tagger = posTagger();

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

let searchParams = {
  q: "thanks",
  count: 50,
  result_type: 'recent',
  lang: 'en'
}

// const tweets = [];

client.get('search/tweets', searchParams, (err, data, res) => {
  if (err) {console.log(`ERROR: ${err}`)};
  // for (let tweet of data.statuses) {
  //   tweets.push(tweet.text);
  // }

  let tweets = data.statuses.map(tweet => tweet.text);

  for (let tweet of tweets) {
    const taggedSentence = tagger.tagSentence(tweet);
    let thanksIndex = taggedSentence.findIndex((word) => word.normal === 'thanks');
    // Find NNS likely associated with "thanks"
    // Just kidding let's not do that
    let NNSs = taggedSentence.filter(word => word.pos === 'NNS' && word.normal !== 'thanks');
    for (let NNS of NNSs) {
      // Get normal form
      let normal = NNS.normal;
      // Choose whether we're making a "thanks" or "bless you" blend -- For now, do this at random; later, keep a log of what's been said in the past
      let prefix = (Math.random() > 0.5) ? "thanks" : "bless you"
      let blend = blender(prefix, normal);
      console.log(`${capitalize(prefix)}, ${normal}. ${capitalize(blend)}.`); // For now, log things instead of tweeting them
    }
  }
})