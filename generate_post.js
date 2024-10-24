// generate_post.js

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { Configuration } = require('openai');


// Ensure correct usage as a constructor
const config = new Configuration(options);
(async () => {
    try {
        // Check if API key is provided
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set. Please add it to your GitHub Secrets.');
        }

        // Initialize OpenAI API
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAI(configuration);

        // Generate a blog post title and content
        const prompt = `
You are an AI language model that writes insightful and engaging blog posts about Artificial Intelligence. Generate a blog post with the following structure:

Title:
[A catchy and descriptive title about a topic in AI]

Description:
[A short summary of the blog post]

Content:
[Detailed content of the blog post, including an introduction, main sections, and conclusion. Use appropriate HTML tags like <h2>, <p>, <ul>, <li>, etc.]

Date:
[Current date in YYYY-MM-DD format]
`;

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1500,
            temperature: 0.7,
            n: 1,
            stop: null,
        });

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            throw new Error('No response from OpenAI API.');
        }

        const text = response.data.choices[0].text.trim();

        // Parse the generated text into a JSON object
        const post = parseGeneratedText(text);

        if (post) {
            // Assign a unique ID to the post
            post.id = generateUniqueId();

            // Save the post as a JSON file
            const filePath = path.join(__dirname, 'posts', `post${post.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(post, null, 4));

            // Update posts.json
            updatePostsJson(post);

            console.log('New blog post generated successfully.');
        } else {
            throw new Error('Failed to parse the generated post.');
        }
    } catch (error) {
        console.error('Error generating blog post:', error.message);
        process.exit(1);
    }
})();

function parseGeneratedText(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const post = {};
    let contentStarted = false;

    lines.forEach(line => {
        if (line.startsWith('Title:')) {
            post.title = line.replace('Title:', '').trim();
        } else if (line.startsWith('Description:')) {
            post.description = line.replace('Description:', '').trim();
        } else if (line.startsWith('Content:')) {
            contentStarted = true;
            post.content = line.replace('Content:', '').trim();
        } else if (line.startsWith('Date:')) {
            post.date = line.replace('Date:', '').trim();
        } else {
            if (contentStarted) {
                post.content += '\n' + line;
            }
        }
    });

    return post.title && post.content && post.date ? post : null;
}

function generateUniqueId() {
    return Date.now().toString();
}

function updatePostsJson(newPost) {
    const postsFilePath = path.join(__dirname, 'posts', 'posts.json');
    let posts = [];

    if (fs.existsSync(postsFilePath)) {
        const existingPostsData = fs.readFileSync(postsFilePath, 'utf8');
        posts = JSON.parse(existingPostsData);
    }

    posts.push(newPost);

    // Sort posts by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 4));
}
