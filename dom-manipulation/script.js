let quotes = [];
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

// Load from local storage on start
window.onload = () => {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }

  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) categoryFilter.value = savedFilter;

  populateCategories();
  showRandomQuote();
};

// Show a random quote
function showRandomQuote() {
  const category = categoryFilter.value;
  const filtered = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    quoteDisplay.innerText = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.innerText = `"${filtered[randomIndex].text}" — ${filtered[randomIndex].category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert('Please fill in both fields.');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote();
}

// Save to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat =>
    `<option value="${cat}">${cat}</option>`).join('');

  const saved = localStorage.getItem('selectedCategory');
  if (saved && categories.includes(saved)) {
    categoryFilter.value = saved;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid format.');
      }
    } catch (err) {
      alert('Error reading file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Optional: Sync simulation with server every 10 seconds
setInterval(() => {
  fetch('https://jsonplaceholder.typicode.com/posts?_limit=1')
    .then(res => res.json())
    .then(serverData => {
      // Example logic: prepend a fake quote from server
      const newQuote = {
        text: serverData[0].title,
        category: 'server'
      };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      console.log('Synced with server!');
    });
}, 10000);

newQuoteBtn.addEventListener('click', showRandomQuote);
