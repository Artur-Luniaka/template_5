document.addEventListener("DOMContentLoaded", function () {
  // Load content from JSON
  loadContent();

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      // Animate hamburger to X
      const spans = menuToggle.querySelectorAll("span");
      spans.forEach((span) => span.classList.toggle("active"));
    });
  }

  // Cookie bar
  const cookieBar = document.getElementById("cookieBar");
  const acceptCookies = document.getElementById("acceptCookies");
  const whatFor = document.getElementById("whatFor");

  // Check if user has already accepted cookies
  if (!localStorage.getItem("cookiesAccepted")) {
    setTimeout(() => {
      if (cookieBar) {
        cookieBar.classList.add("show");
      }
    }, 2000);
  }

  if (acceptCookies) {
    acceptCookies.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBar.classList.remove("show");
    });
  }

  if (whatFor) {
    whatFor.addEventListener("click", function (e) {
      e.preventDefault();
      alert(
        'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept," you consent to our use of cookies.'
      );
    });
  }

  // Page contact form
  const pageContactForm = document.getElementById("pageContactForm");

  if (pageContactForm) {
    pageContactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const name = pageContactForm.querySelector("#contactName").value;
      const email = pageContactForm.querySelector("#contactEmail").value;
      const subject = pageContactForm.querySelector("#contactSubject").value;
      const message = pageContactForm.querySelector("#contactMessage").value;

      // Simulate form submission
      alert(
        `Thank you, ${name}! Your message regarding "${subject}" has been sent. We'll get back to you at ${email} as soon as possible.`
      );

      // Reset form
      pageContactForm.reset();
    });
  }

  // Game iframe responsive height
  const gameFrame = document.getElementById("gameFrame");

  if (gameFrame) {
    // Set initial height
    adjustGameFrameHeight();

    // Adjust on window resize
    window.addEventListener("resize", adjustGameFrameHeight);
  }
});

// Load content from JSON
function loadContent() {
  fetch("data/content.json")
    .then((response) => response.json())
    .then((data) => {
      // Update page content based on JSON data
      updatePageContent(data);
    })
    .catch((error) => {
      console.error("Error loading content:", error);
    });
}

// Update page content with JSON data
function updatePageContent(data) {
  // Get current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Update page-specific content
  if (data.pages && data.pages[currentPage]) {
    const pageData = data.pages[currentPage];

    // Update page title
    if (pageData.title) {
      document.title = pageData.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && pageData.description) {
      metaDescription.setAttribute("content", pageData.description);
    }

    // Update page content
    Object.keys(pageData.content || {}).forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        if (typeof pageData.content[selector] === "string") {
          element.innerHTML = pageData.content[selector];
        } else if (typeof pageData.content[selector] === "object") {
          // Handle attributes
          Object.keys(pageData.content[selector]).forEach((attr) => {
            if (attr === "text" || attr === "html") {
              element.innerHTML = pageData.content[selector][attr];
            } else {
              element.setAttribute(attr, pageData.content[selector][attr]);
            }
          });
        }
      }
    });
  }

  // Update global content
  if (data.global) {
    Object.keys(data.global).forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (typeof data.global[selector] === "string") {
          element.innerHTML = data.global[selector];
        } else if (typeof data.global[selector] === "object") {
          // Handle attributes
          Object.keys(data.global[selector]).forEach((attr) => {
            if (attr === "text" || attr === "html") {
              element.innerHTML = data.global[selector][attr];
            } else {
              element.setAttribute(attr, data.global[selector][attr]);
            }
          });
        }
      });
    });
  }
}

// Adjust game iframe height
function adjustGameFrameHeight() {
  const gameFrame = document.getElementById("gameFrame");
  if (gameFrame) {
    const width = gameFrame.offsetWidth;
    // 16:9 aspect ratio
    const height = (width * 9) / 16;
    gameFrame.style.height = `${height}px`;
  }
}
