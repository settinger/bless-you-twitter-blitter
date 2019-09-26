// Retrieve tweets with "thanks" or "bless you" in the tweet body
// Perform part-of-speech (POS) tagging to find plural noun phrases (NNS) near "thanks" or "bless you"
// Create a word blend (portmanteau) of the plural noun phrase and "thanks" or "bless you"
// Draft a tweet of the word blend so a human can manually observe and approve/reject it later

require("dotenv").config();
const twitter = require("twitter");
const posTagger = require("wink-pos-tagger");

const Normal = require("./models/normal");
const mongoose = require("mongoose");

const { blender, capitalize } = require("./blends");

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "twitter-blitter";

const tweetATweet = () => {
  // Connect to MongoDB
  mongoose
    .connect(`${MONGODB_URI}/${DATABASE_NAME}`, { useNewUrlParser: true })
    .then(msg => {
      // Retrieve all tweetable words
      Normal.find({ tweeted: { $lt: 2 } })
        .then(array => {
          // Pick a random word from the array
          const index = Math.floor(Math.random() * array.length);
          const word = array[index]["word"];
          const tweeted = array[index]["tweeted"];
          console.log(word, tweeted);
          let prefix, blend;
          // If word has been tweeted 0 times AND does not begin with "th": tweet "Thanks, X"
          // Else if word has been tweeted 1 time AND does not begin with "bl": tweet "Bless you, X"
          // Else: tweet "Write that down in your copybooks now."
          let tweet = "Write that down in your copybooks now.";
          if (tweeted === 0 && word.slice(0, 2) !== "th") {
            prefix = "thanks";
            blend = blender(prefix, word);
            tweet = `${capitalize(prefix)}, ${word}. ${capitalize(blend)}.`;
          } else if (tweeted === 1 && word.slice(0, 2) !== "bl") {
            prefix = "bless you";
            blend = blender(prefix, word);
            tweet = `${capitalize(prefix)}, ${word}. ${capitalize(blend)}.`;
          }
          // Tweet it
          console.log(tweet);
          // Increment the number of times the word's been tweeted
          Normal.findOneAndUpdate({ word }, { tweeted: tweeted + 1 }).then(
            tw => {
              client
                .post("statuses/update", { status: tweet })
                .then(tweetEvent => {
                  console.log(tweetEvent.text);
                })
                .catch(err => {
                  throw err;
                });
            }
          );
        })
        .catch(err => {
          console.log("Error finding tweetable words");
        });
    })
    .catch(err => {
      console.log("Error connecting to DB");
    });
};

tweetATweet();

setTimeout(() => {
  setInterval(() => {
    tweetATweet();
  }, 1000 * 60 * 60);
}, 1000);
