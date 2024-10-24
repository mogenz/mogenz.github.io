// script.js

// Sample blog posts data
const blogPosts = [
    {
        title: "Understanding AI",
        description: "An introductory guide to artificial intelligence.",
        content: "Full content of the blog post.",
        date: "2023-10-01"
    },
    {
        title: "Machine Learning Basics",
        description: "Basics of machine learning explained.",
        content: "Full content of the blog post.",
        date: "2023-10-05"
    },
    {
        title: "Deep Learning Advances",
        description: "Latest advances in deep learning technologies.",
        content: "Full content of the blog post.",
        date: "2023-10-10"
    },
    // Add more blog posts as needed
];

// Function to display latest post
function displayLatestPost() {
    const latestPost = blogPosts[0]; // Assuming the first post is the latest
    document.getElementById('latest-post-title').textContent = latestPost.title;
    document.getElementById('latest-post-description').textContent = latestPost.description;
}

// Function to display grid view of posts
function displayPostGrid() {
    const gridContainer = document.getElementById('grid-container');
    blogPosts.slice(1, 4).forEach(post => { // Show next three posts
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.description}</p>
        `;
        gridContainer.appendChild(gridItem);
    });
}

// Function to display searchable post list
function displayPostList() {
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    blogPosts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = post.title;
        postList.appendChild(listItem);
    });
}

// Search functionality
document.getElementById('search-bar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchTerm));
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    filteredPosts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = post.title;
        postList.appendChild(listItem);
    });
});

// FAQ collapsible functionality
document.querySelectorAll('.faq-question').forEach(button => {
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

// Initialize functions
displayLatestPost();
displayPostGrid();
displayPostList();
