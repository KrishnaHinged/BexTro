import express from "express";

const router = express.Router();

const quotes = [
  { text: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "If opportunity doesn’t knock, build a door.", author: "Milton Berle" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
  { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
  { text: "Difficulties in life are intended to make us better, not bitter.", author: "Dan Reeves" },
  { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Act without expectation.", author: "Lao Tzu" },
  { text: "A ship is safe in harbor, but that’s not what ships are for.", author: "William G.T. Shedd" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford" },
  { text: "Don’t limit your challenges. Challenge your limits.", author: "Jerry Dunn" },
  { text: "Do what you love and you'll never work a day in your life.", author: "Marc Anthony" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Life isn’t about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "You must do the things you think you cannot do.", author: "Eleanor Roosevelt" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Hustle in silence and let your success make the noise.", author: "Unknown" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
  { text: "Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.", author: "Jamie Paolinetti" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Failure will never overtake me if my determination to succeed is strong enough.", author: "Og Mandino" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.", author: "Roy T. Bennett" },
  { text: "Always do your best. What you plant now, you will harvest later.", author: "Og Mandino" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Be so good they can’t ignore you.", author: "Steve Martin" },
  { text: "Live each day as if your life had just begun.", author: "Johann Wolfgang Von Goethe" },
  { text: "I never dreamed about success. I worked for it.", author: "Estee Lauder" },
  { text: "Setting goals is the first step in turning the invisible into the visible.", author: "Tony Robbins" },
  { text: "One day or day one. You decide.", author: "Paulo Coelho" },
  { text: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.", author: "Marie Forleo" }
];

router.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.json(quotes[randomIndex]);
});

export default router;
