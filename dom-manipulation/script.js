const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" },
  { text: "JavaScript is the duct tape of the Internet.", category: "Programming" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");

function updateCategoryOptions() {
  // Get unique categories
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  updateCategoryOptions();

  alert("Quote added successfully!");
}

updateCategoryOptions();

newQuoteBtn.addEventListener("click", showRandomQuote);
