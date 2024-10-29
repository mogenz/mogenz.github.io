// script.js

let blogPosts = [];

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

async function fetchCountdownData() {
    try {
        const response = await fetch('countdown.json');
        if (!response.ok) throw new Error('Failed to load countdown data');
        
        const data = await response.json();
        initializeCountdown(new Date(data.endTime));
    } catch (error) {
        console.error('Error fetching countdown data:', error);
    }
}

function displayPostGrid(postsToDisplay = []) {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) return;

    // If no specific posts are provided, display all posts
    if (postsToDisplay.length === 0) {
        postsToDisplay = blogPosts;
    }

    // Clear existing content
    gridContainer.innerHTML = '';

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

function initializeCountdown(endTime) {
    const countdownElement = document.getElementById('countdown-timer');
    const redirectButton = document.getElementById('redirect-button');

    function updateCountdown() {
        const now = new Date();
        const distance = endTime - now;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = '00:00:00';
            triggerNextCountdownCycle();
        } else {
            redirectButton.style.display = 'none';

            const hours = Math.floor((distance / (1000 * 60 * 60)) % 72);
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.textContent = `
                ${String(hours).padStart(2, '0')}:
                ${String(minutes).padStart(2, '0')}:
                ${String(seconds).padStart(2, '0')}
            `.replace(/\s/g, '');
        }
    }

    updateCountdown(); // Initial call to display the countdown immediately
    const countdownInterval = setInterval(updateCountdown, 1000); // Update every second
}

async function triggerNextCountdownCycle() {
    const newEndTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
    await updateCountdownJson(newEndTime);
    initializeCountdown(new Date(newEndTime));
}

async function updateCountdownJson(newEndTime) {
    try {
        const response = await fetch('/api/updateCountdown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endTime: newEndTime })
        });

        if (!response.ok) {
            throw new Error('Failed to update countdown.json');
        }
        console.log('Countdown reset to:', newEndTime);
    } catch (error) {
        console.error('Error updating countdown.json:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPosts().then(() => {
        if (document.body.classList.contains('home')) {
            displayPostGrid(blogPosts.slice(0, 8));
            displayPostList();

            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
                searchBar.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
                    displayPostList(filteredPosts);
                });
            }
        } else if (document.body.classList.contains('all-posts')) {
            displayPostGrid();

            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
                searchBar.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
                    displayPostGrid(filteredPosts);
                });
            }
        } else if (document.body.classList.contains('post')) {
            displayFullPost();
        } else if (document.body.classList.contains('countdown')) {
            fetchCountdownData();
        }
    });

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
