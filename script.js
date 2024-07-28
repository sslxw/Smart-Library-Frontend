const bookGrid = document.getElementById('book-grid');
const searchButton = document.getElementById('search-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const searchInput = document.getElementById('search-input');
let currentPage = 1;
const pageSize = 8;

const colors = ['#9A979B', '#E0E0E0', '#9A979B', '#E0E0E0']; 

async function fetchBooks(page, pageSize) {
    try {
        const response = await fetch(`http://localhost:8000/books?page=${page}&page_size=${pageSize}`);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const books = await response.json();
        console.log('Books fetched:', books); // Log fetched books
        displayBooks(books);
        updatePaginationButtons(books.length, pageSize);
    } catch (error) {
        alert(error.message);
    }
}

function displayBooks(books) {
    bookGrid.innerHTML = '';
    books.forEach((book, index) => {
        console.log('Book cover URL:', book.cover_url); // Log cover URL
        const bookCard = document.createElement('div');
        bookCard.className = 'book';
        bookCard.style.backgroundColor = colors[index % colors.length];
        bookCard.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <div class="book-title">${book.title}</div>
        `;
        bookGrid.appendChild(bookCard);
    });
}

function updatePaginationButtons(bookCount, pageSize) {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = bookCount < pageSize;
}

searchButton.addEventListener('click', () => {
    currentPage = 1;
    fetchBooks(currentPage, pageSize);
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(currentPage, pageSize);
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchBooks(currentPage, pageSize);
});

// Fetch initial set of books
fetchBooks(currentPage, pageSize);
