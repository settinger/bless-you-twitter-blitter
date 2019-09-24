# Bless you, Twitter. Blitter.

In *Look Around You*, episode 2 ("Water"), the narrator talks to some ants:

> Thanks, ants. Thants.

and, later:

> Bless you, ants. Blants.

Here's the source to my twitter bot that continues the tradition.

## Getting started

To generate a database of words, I'm using the [npm Twitter package](https://www.npmjs.com/package/twitter) to fetch a live stream of people saying "thanks". I'm using the [Wink part-of-speech tagger](https://www.npmjs.com/package/wink-pos-tagger) to identify plural nouns. They're compared against the [iscool checker](https://npmjs.com/package/iscool) to make sure they aren't rude words. I'm storing the words in a MongoDB database.

Run `node grow_database.js` to add new words to the database. Run `node index.js` to tweet a random word from the database every hour.

I'm still learning node.js! Let me know if you have suggestions or thoughts!
