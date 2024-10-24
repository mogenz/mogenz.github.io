// script.js

let blogPosts = [];
let countdownEndTime = null;

document.addEventListener('DOMContentLoaded', function() {
    // Fetch posts and countdown, then initialize the page
    Promise.all([fetchPosts(), fetchCountdown()]).then(() => {
        if (document.body.classList.contains('home')) {
            displayPostGrid();
            displayPostList();
        } else if (document.body.classList.contains('post')) {
            displayFullPost();
        } else if (document.body.classList.contains('countdown')) {
            initializeCountdown();
        }
    });

    let blogPosts = [];
    let countdownEndTime = null;

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

    async function fetchCountdown() {
        try {
            const response = await fetch('countdown.json');
            const data = await response.json();
            countdownEndTime = data.endTime;
        } catch (error) {
            console.error('Error fetching countdown:', error);
        }
    }

    function initializeCountdown() {
        const countdownElement = document.getElementById('countdown-timer');
        const redirectButton = document.getElementById('redirect-button');

        if (!countdownEndTime) {
            countdownElement.textContent = "00:00:00";
            return;
        }

        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(countdownEndTime).getTime() - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = "00:00:00";
                redirectButton.style.display = 'inline-block';
            } else {
                const hours = Math.floor((distance / (1000 * 60 * 60)));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.textContent = `
                    ${String(hours).padStart(2, '0')}:
                    ${String(minutes).padStart(2, '0')}:
                    ${String(seconds).padStart(2, '0')}
                `.replace(/\s/g, '');
            }
        }, 1000);

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

    // Function to display full blog post on post.html
    function displayFullPost() {
        if (typeof blogPosts === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('postId');
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-date').textContent = `Published on ${post.date}`;
            document.getElementById('post-content').innerHTML = post.content;
            document.getElementById('breadcrumb-post-title').textContent = post.title;
        } else {
            document.getElementById('post-title').textContent = "Post Not Found";
            document.getElementById('post-content').textContent = "The blog post you are looking for does not exist.";
        }
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

    // Initialize functions based on page
    if (document.body.classList.contains('home')) {
        displayPostGrid();
        displayPostList();
    } else if (document.body.classList.contains('post')) {
        displayFullPost();
    }
// Countdown Timer for countdown.html
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('countdown')) {
        initializeCountdown();
    }

    function initializeCountdown() {
        const countdownElement = document.getElementById('countdown-timer');
        const redirectButton = document.getElementById('redirect-button');

        // Set the target date/time for the countdown (replace with your logic)
        let countdownEndTime = localStorage.getItem('countdownEndTime');

        if (!countdownEndTime || new Date(countdownEndTime) < new Date()) {
            // Set new countdown end time 72 hours from now
            countdownEndTime = new Date(new Date().getTime() + 72 * 60 * 60 * 1000).toISOString();
            localStorage.setItem('countdownEndTime', countdownEndTime);
        }

        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(countdownEndTime).getTime() - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = "00:00:00";
                redirectButton.style.display = 'inline-block';

                // Optionally, reset the countdown
                // countdownEndTime = new Date(new Date().getTime() + 72 * 60 * 60 * 1000).toISOString();
                // localStorage.setItem('countdownEndTime', countdownEndTime);
            } else {
                const hours = Math.floor((distance / (1000 * 60 * 60)));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.textContent = `
                    ${String(hours).padStart(2, '0')}:
                    ${String(minutes).padStart(2, '0')}:
                    ${String(seconds).padStart(2, '0')}
                `.replace(/\s/g, '');
            }
        }, 1000);

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
});

