document.addEventListener("DOMContentLoaded", function () {
  // Load news data
  loadNewsData();

  // Filter buttons functionality
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Filter news items
        const filter = this.getAttribute("data-filter");
        filterNewsItems(filter);
      });
    });
  }
});

// Load news data from JSON
function loadNewsData() {
  fetch("data/news.json")
    .then((response) => response.json())
    .then((data) => {
      // Render news items
      renderNewsItems(data.news);

      // Initialize pagination
      initPagination(data.news);
    })
    .catch((error) => {
      console.error("Error loading news data:", error);

      // Show error message
      const newsGrid = document.getElementById("newsGrid");
      if (newsGrid) {
        newsGrid.innerHTML =
          '<div class="news-error">Failed to load news. Please try again later.</div>';
      }
    });
}

// Render news items
function renderNewsItems(newsItems, page = 1, itemsPerPage = 6) {
  const newsGrid = document.getElementById("newsGrid");

  if (!newsGrid) return;

  // Clear loading message
  newsGrid.innerHTML = "";

  // Calculate start and end index for pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = newsItems.slice(startIndex, endIndex);

  // Check if there are items to display
  if (paginatedItems.length === 0) {
    newsGrid.innerHTML = '<div class="news-empty">No news items found.</div>';
    return;
  }

  // Create news items
  paginatedItems.forEach((item) => {
    const newsItem = document.createElement("div");
    newsItem.className = "news-item";
    newsItem.setAttribute("data-category", item.category);

    newsItem.innerHTML = `
            <div class="news-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="news-content">
                <div class="news-date">${formatDate(item.date)}</div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${item.excerpt}</p>
                <span class="news-category">${item.category}</span>
            </div>
        `;

    newsGrid.appendChild(newsItem);
  });

  // Store all news items for filtering
  newsGrid.setAttribute("data-all-news", JSON.stringify(newsItems));
}

// Initialize pagination
function initPagination(newsItems, itemsPerPage = 6) {
  const pagination = document.getElementById("newsPagination");

  if (!pagination) return;

  // Clear pagination
  pagination.innerHTML = "";

  // Calculate total pages
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  // Create pagination buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "page-btn";
    pageBtn.textContent = i;

    // Set active class for first page
    if (i === 1) {
      pageBtn.classList.add("active");
    }

    // Add click event
    pageBtn.addEventListener("click", function () {
      // Remove active class from all buttons
      document
        .querySelectorAll(".page-btn")
        .forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get current filter
      const activeFilter = document.querySelector(".filter-btn.active");
      const filter = activeFilter
        ? activeFilter.getAttribute("data-filter")
        : "all";

      // Filter and paginate news items
      const filteredItems =
        filter === "all"
          ? newsItems
          : newsItems.filter((item) => item.category.toLowerCase() === filter);

      // Render news items for selected page
      renderNewsItems(filteredItems, i, itemsPerPage);
    });

    pagination.appendChild(pageBtn);
  }
}

// Filter news items
function filterNewsItems(filter) {
  const newsGrid = document.getElementById("newsGrid");

  if (!newsGrid) return;

  // Get all news items from data attribute
  const allNews = JSON.parse(newsGrid.getAttribute("data-all-news") || "[]");

  // Filter news items
  const filteredItems =
    filter === "all"
      ? allNews
      : allNews.filter((item) => item.category.toLowerCase() === filter);

  // Reset pagination to first page
  const paginationButtons = document.querySelectorAll(".page-btn");
  if (paginationButtons.length > 0) {
    paginationButtons.forEach((btn) => btn.classList.remove("active"));
    paginationButtons[0].classList.add("active");
  }

  // Render filtered news items
  renderNewsItems(filteredItems);

  // Reinitialize pagination
  initPagination(filteredItems);
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}
