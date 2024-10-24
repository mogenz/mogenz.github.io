// script.js

let blogPosts = [];
let countdownEndTime = null;

document.addEventListener('DOMContentLoaded', function() {
    // Fetch posts and then initialize the page
    fetchPosts().then(() => {
        if (document.body.classList.contains('home')) {
            displayPostGrid();
            displayPostList();
        } else if (document.body.classList.contains('post')) {
            displayFullPost();
        } else if (document.body.classList.contains('countdown')) {
            initializeCountdown();
        }
    });

    // Search functionality
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
            displayPostList(filteredPosts);
        });
    }

    // FAQ collapsible functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('active');
                const faqAnswer = button.nextElementSibling;
                if (faqAnswer.style.maxHeight) {
                    faqAnswer.style.maxHeight = null;
                } else {
                    faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
                }
            });
        });
    }

    // Back to Top Button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Function to fetch posts
async function fetchPosts() {
    try {
        const response = await fetch('posts/posts.json');
        blogPosts = await response.json();
        // Sort posts by date (assuming date format is YYYY-MM-DD)
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Store the latest post ID for the countdown redirect
        if (blogPosts.length > 0) {
            localStorage.setItem('latestPostId', blogPosts[0].id);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function initializeCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    const redirectButton = document.getElementById('redirect-button');

    const now = Date.now();
    const startTime = new Date('2023-01-01T00:00:00Z').getTime(); // Fixed start time
    const period = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

    // Calculate the number of periods since the start time
    const periodsSinceStart = Math.floor((now - startTime) / period);

    // Calculate the next countdown end time
    countdownEndTime = startTime + (periodsSinceStart + 1) * period;

    // Start the countdown
    updateCountdown();

    const countdownInterval = setInterval(() => {
        updateCountdown();
    }, 1000);

    function updateCountdown() {
        const now = Date.now();
        const distance = countdownEndTime - now;

        if (distance <= 0) {
            // Reset countdown to the next period
            countdownEndTime += period;

            // Show the redirect button
            redirectButton.style.display = 'inline-block';
        } else {
            // Hide the redirect button if countdown is running
            redirectButton.style.display = 'none';
        }

        // Update the countdown display
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 72);
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.textContent = `
            ${String(hours).padStart(2, '0')}:
            ${String(minutes).padStart(2, '0')}:
            ${String(seconds).padStart(2, '0')}
        `.replace(/\s/g, '');
    }

    redirectButton.addEventListener('click', () => {
        // Redirect to the latest blog post
        const latestPostId = localStorage.getItem('latestPostId');
        if (latestPostId) {
            window.location.href = `post.html?postId=${latestPostId}`;
        } else {
            window.location.href = 'index.html';
        }
    });
}


    function updateCountdownDisplay(distance) {
        const hours = Math.floor((distance / (1000 * 60 * 60)));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.textContent = `
            ${String(hours).padStart(2, '0')}:
            ${String(minutes).padStart(2, '0')}:
            ${String(seconds).padStart(2, '0')}
        `.replace(/\s/g, '');
    }
}
// Function to display the post grid on the homepage
function displayPostGrid() {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer || blogPosts.length === 0) return;

    // Clear existing content
    gridContainer.innerHTML = '';

    // Display the latest 6 posts (adjust as needed)
    const postsToDisplay = blogPosts.slice(0, 6);

    postsToDisplay.forEach(post => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <h3><a href="post.html?postId=${post.id}">${post.title}</a></h3>
            <p>${post.description}</p>
        `;
        gridContainer.appendChild(gridItem);
    });
}

// Function to display the searchable post list
function displayPostList(posts = blogPosts) {
    const postList = document.getElementById('post-list');
    if (!postList) return;

    // Clear existing content
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="post.html?postId=${post.id}">${post.title}</a>`;
        postList.appendChild(listItem);
    });
}

// Function to display full blog post on post.html
function displayFullPost() {
    if (blogPosts.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-date').textContent = `Published on ${post.date}`;
        document.getElementById('post-content').innerHTML = post.content;
        const breadcrumbPostTitle = document.getElementById('breadcrumb-post-title');
        if (breadcrumbPostTitle) {
            breadcrumbPostTitle.textContent = post.title;
        }
    } else {
        document.getElementById('post-title').textContent = "Post Not Found";
        document.getElementById('post-content').textContent = "The blog post you are looking for does not exist.";
    }
}
