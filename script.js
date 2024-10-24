// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to display latest post
    function displayLatestPost() {
        if (typeof blogPosts === 'undefined' || blogPosts.length === 0) return;
        const latestPost = blogPosts[0]; // Assuming the first post is the latest

        const latestPostTitle = document.getElementById('latest-post-title');
        const latestPostDescription = document.getElementById('latest-post-description');

        latestPostTitle.textContent = latestPost.title;
        latestPostTitle.href = `post.html?postId=${latestPost.id}`;

        latestPostDescription.textContent = latestPost.description;
        latestPostDescription.href = `post.html?postId=${latestPost.id}`;
    }

    // Function to display grid view of posts
    function displayPostGrid() {
        const gridContainer = document.getElementById('grid-container');
        if (!gridContainer || typeof blogPosts === 'undefined') return;
        blogPosts.slice(1, 4).forEach(post => { // Show next three posts
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.innerHTML = `
                <h3><a href="post.html?postId=${post.id}">${post.title}</a></h3>
                <p>${post.description}</p>
            `;
            gridContainer.appendChild(gridItem);
        });
    }

    // Function to display searchable post list
    function displayPostList(posts = blogPosts) {
        const postList = document.getElementById('post-list');
        if (!postList) return;
        postList.innerHTML = '';
        posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="post.html?postId=${post.id}">${post.title}</a>`;
            postList.appendChild(listItem);
        });
    }

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
        displayLatestPost();
        displayPostGrid();
        displayPostList();
    } else if (document.body.classList.contains('post')) {
        displayFullPost();
    }
});
