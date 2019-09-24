// Retrieve tweets with "thanks" or "bless you" in the tweet body
// Perform part-of-speech (POS) tagging to find plural noun phrases (NNS) near "thanks" or "bless you"
// Create a word blend (portmanteau) of the plural noun phrase and "thanks" or "bless you"
// Draft a tweet of the word blend so a human can manually observe and approve/reject it later

require("dotenv").config();
const twitter = require("twitter");
const posTagger = require("wink-pos-tagger");
const iscool = require("iscool");

const Normal = require("./models/normal");
const mongoose = require("mongoose");

const tagger = posTagger();

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "twitter-blitter";

let streamParams = {
  track: "thanks"
};

let blend;
let blacklist = [
  // I just learned about the NPM package "iscool" so the blacklist shouldn't be necessary anymore
  "thanks",
  "https",
  "weapons",
  "guns",
  "raids",
  "tories",
  "memes",
  "leftists",
  "hets",
  "boomers"
];
const isCool = iscool();

const getStreamEvent = event => {
  tweet = event && event.text;
  if (typeof tweet === "undefined") return;
  // Tag words using POS-tagger and find plural nouns (NNS)
  const taggedSentence = tagger.tagSentence(tweet);
  let NNSs = taggedSentence.filter(
    word =>
      word.pos === "NNS" &&
      !blacklist.includes(word.normal) &&
      isCool(word.normal)
  );

  // Create word blends
  for (let NNS of NNSs) {
    // Get normal form
    let normal = NNS.normal;
    // Connect to MongoDB
    mongoose
      .connect(`${MONGODB_URI}/${DATABASE_NAME}`, { useNewUrlParser: true })
      .then(msg => {
        // Check if the normal appears in database
        Normal.findOne({ word: normal })
          .then(norm => {
            if (!norm) {
              // Add to database
              console.log(normal);
              Normal.create({ word: normal, tweeted: 0 })
                .then(() => {
                  mongoose.connection.close();
                })
                .catch(err => {
                  console.log("Failed to create blend err1", err);
                });
            } else {
              mongoose.connection.close();
            }
          })
          .catch(err => {
            console.log("Failed to create blend err2");
          });
      })
      .catch(err => {
        console.log("Failed to create blend err3");
      });
  }
};

const eventList = [];

const streamer = client.stream("statuses/filter", streamParams);
streamer.on("error", err => console.log(err));
streamer.on("data", e => {
  if (eventList.length < 1000) {
    eventList.push(e);
  }
});

setTimeout(() => {
  setInterval(() => {
    // console.log("a");
    getStreamEvent(eventList.pop());
  }, 80);
}, 1000);
