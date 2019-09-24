/*
let searchParams = {
  q: "thanks",
  count: 50,
  result_type: 'recent',
  lang: 'en'
}
const getTweets = (err, data, res) => {
  if (err) {console.log(`ERROR: ${err}`)};
  let tweets = data.statuses.map(tweet => tweet.text);

  // Tag words using POS-tagger and find plural nouns (NNS)
  for (let tweet of tweets) {
    const taggedSentence = tagger.tagSentence(tweet);
    let thanksIndex = taggedSentence.findIndex((word) => word.normal === 'thanks');
    // Find NNS likely associated with "thanks"
    // Just kidding; we'll just find every NNS
    let NNSs = taggedSentence.filter(word => word.pos === 'NNS' && word.normal !== 'thanks');

    // Create word blends
    for (let NNS of NNSs) {
      // Get normal form
      let normal = NNS.normal;
      // Choose whether we're making a "thanks" or "bless you" blend -- For now, do this at random; later, keep a log of what's been said in the past
      let prefix = (Math.random() > 0.5) ? "thanks" : "bless you"
      let blend = blender(prefix, normal);
      console.log(`${capitalize(prefix)}, ${normal}. ${capitalize(blend)}.`); // For now, log things instead of tweeting them
    }
  }
}
client.get('search/tweets', searchParams, getTweets);
*/
