// Rule-based quick add: reads a line like "coffee 180 food today" and returns
// the fields. It runs in the browser, so it needs no AI service or API key.

const KEYWORDS = {
    Food: ["food", "lunch", "dinner", "breakfast", "coffee", "tea", "chai", "snack", "snacks", "swiggy", "zomato", "restaurant", "pizza", "burger", "cafe"],
    Grocery: ["grocery", "groceries", "vegetables", "milk", "bigbasket", "blinkit", "dmart"],
    Transport: ["uber", "ola", "cab", "taxi", "auto", "rapido", "metro", "bus", "train", "petrol", "fuel", "parking"],
    Travel: ["flight", "flights", "hotel", "trip", "airbnb", "travel", "visa"],
    Shopping: ["shopping", "clothes", "shoes", "sneakers", "shirt", "amazon", "flipkart", "myntra"],
    Bills: ["bill", "bills", "electricity", "rent", "wifi", "internet", "recharge", "water", "gas", "phone"],
    Entertainment: ["movie", "movies", "netflix", "spotify", "concert", "cinema", "game", "games", "show"],
    Education: ["course", "books", "book", "fees", "udemy", "class", "tuition"],
    Health: ["medicine", "medicines", "doctor", "pharmacy", "gym", "hospital", "health"],
  };
  
  const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const AMOUNT_TOKEN = /^(₹|rs\.?|inr)?\d[\d,]*(\.\d+)?k?$/i;
  const CURRENCY_ONLY = /^(₹|rs\.?|inr)$/i;
  
  const isoDate = (date) => date.toLocaleDateString("en-CA");
  
  function categoryFor(word) {
    if (!word) return null;
    if (KEYWORDS[capitalise(word)]) return capitalise(word);
    for (const [category, words] of Object.entries(KEYWORDS)) {
      if (words.includes(word)) return category;
    }
    return null;
  }
  
  function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  
  export function parseQuickAdd(input, today = new Date()) {
    const text = String(input || "").trim();
    const tokens = text.split(/\s+/).filter(Boolean);
    const lowerTokens = tokens.map((token) => token.toLowerCase());
  
    // Amount: "180", "1,450", "2.5k", "₹300", "rs 300".
    let amount = 0;
    let amountIndex = -1;
    lowerTokens.forEach((token, index) => {
      if (amountIndex !== -1 || !AMOUNT_TOKEN.test(token)) return;
      amountIndex = index;
      const number = parseFloat(token.replace(/[^\d.]/g, ""));
      amount = /k$/.test(token) ? number * 1000 : number;
    });
    // "rs 300": the amount is the number after a standalone currency word.
    if (amountIndex === -1) {
      const currencyIndex = lowerTokens.findIndex((token) => CURRENCY_ONLY.test(token));
      if (currencyIndex !== -1 && /^\d/.test(lowerTokens[currencyIndex + 1] || "")) {
        amountIndex = currencyIndex + 1;
        amount = parseFloat(lowerTokens[amountIndex].replace(/,/g, ""));
      }
    }
  
    // Date: today (default), yesterday, the last weekday named, or YYYY-MM-DD.
    let date = new Date(today);
    const iso = text.match(/\d{4}-\d{2}-\d{2}/);
    if (iso) {
      date = new Date(`${iso[0]}T00:00:00`);
    } else if (lowerTokens.includes("yesterday")) {
      date.setDate(date.getDate() - 1);
    } else {
      const weekday = lowerTokens.find((token) => WEEKDAYS.includes(token));
      if (weekday) {
        const diff = (today.getDay() - WEEKDAYS.indexOf(weekday) + 7) % 7;
        date.setDate(date.getDate() - diff);
      }
    }
  
    // Category: an explicit category name first, then a keyword.
    const explicit = lowerTokens.find((token) => KEYWORDS[capitalise(token)]);
    const category = categoryFor(explicit) || lowerTokens.map(categoryFor).find(Boolean) || "Other";
  
    // Title: whatever is left once amount, date and category words are removed.
    const dateWords = new Set(["today", "yesterday", "on", "last", ...WEEKDAYS]);
    const kept = tokens.filter((token, index) => {
      const lower = token.toLowerCase();
      if (index === amountIndex || AMOUNT_TOKEN.test(lower) || CURRENCY_ONLY.test(lower)) return false;
      if (dateWords.has(lower) || /^\d{4}-\d{2}-\d{2}$/.test(lower)) return false;
      if (KEYWORDS[capitalise(lower)]) return false;
      return true;
    });
    const titleText = kept.join(" ");
    const title = titleText ? capitalise(titleText) : category;
  
    return {
      title,
      amount: Number.isFinite(amount) ? amount : 0,
      category,
      date: isoDate(date),
      ok: amount > 0,
    };
  }