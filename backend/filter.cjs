// filter.cjs
const Filter = require("bad-words");
const filter = new Filter();
filter.addWords("porn", "kill", "drugs", "violence");

module.exports = filter;