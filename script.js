const bookGrid = document.getElementById('book-grid');
const searchInput = document.getElementById('search-input');
const loadingSpinner = document.getElementById('loading-spinner');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
let currentPage = 1;
const pageSize = 8;
const colors = ['#9A979B', '#E0E0E0', '#9A979B', '#E0E0E0']; 

let debounceTimeout;
let isLoading = false;
let isEndOfList = false;

async function fetchBooks(page, pageSize, query = '', append = false) {
    if (isLoading) return;
    
    isLoading = true;
    loadingSpinner.classList.remove('hidden');
    try {
        // simulating delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(`http://localhost:8000/books?page=${page}&page_size=${pageSize}&query=${query}`);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const books = await response.json();
        isEndOfList = books.length < pageSize;
        console.log('Books fetched:', books);
        if (!append) {
            bookGrid.innerHTML = ''; 
        }
        displayBooks(books);
        updatePaginationButtons();
    } catch (error) {
        alert(error.message);
    } finally {
        isLoading = false;
        loadingSpinner.classList.add('hidden');
    }
}

function displayBooks(books) {
    books.forEach((book, index) => {
        console.log('Book cover URL:', book.cover);
        const bookCard = document.createElement('div');
        bookCard.className = 'book';
        bookCard.innerHTML = `
            <div class="book-inner">
                <div class="book-front">
                    <img src="${book.cover}" alt="${book.title}" aria-label="${book.title}">
                    <div class="book-title">${book.title}</div>
                    <div class="book-rating">${'★'.repeat(book.average_rating)}${'☆'.repeat(5 - book.average_rating)}</div>
                </div>
                <div class="book-back">
                    <div class="book-title">${book.title}</div>
                    <p>${book.description}</p>
                </div>
            </div>
        `;
        bookGrid.appendChild(bookCard);
    });
}

function updatePaginationButtons() {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = isEndOfList;
}

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        currentPage = 1;
        fetchBooks(currentPage, pageSize, searchInput.value);
    }, 300);
});

// Infinite scrolling for mobile
window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768 && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
        currentPage++;
        fetchBooks(currentPage, pageSize, searchInput.value, true);
    }
});

// Pagination for desktop
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(currentPage, pageSize, searchInput.value);
    }
});

nextButton.addEventListener('click', () => {
    if (!isEndOfList) {
        currentPage++;
        fetchBooks(currentPage, pageSize, searchInput.value);
    }
});

// fetching initial books
fetchBooks(currentPage, pageSize);
