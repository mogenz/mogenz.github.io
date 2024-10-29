// generate_post.js

import fs from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

(async () => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set. Please add it to your environment variables.');
        }

        // Prepare the prompt
        const prompt = `
You are an AI language model that writes insightful and engaging blog posts about any topic you choose. Generate a blog post in JSON format with the following structure:

{
  "title": "A catchy and descriptive title about a topic in AI.",
  "description": "A short summary of the blog post.",
  "content": "Detailed content of the blog post, including an introduction, unique insights, main sections, and conclusion. Use HTML tags like <h2>, <p>, <ul>, <li> where appropriate.",
  "date": "A date in YYYY-MM-DD format."
}

Ensure the JSON is properly formatted without any additional text or comments.
        `;

        // Generate the blog post using OpenAI's chat completion
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // Use "gpt-3.5-turbo" or "gpt-4" if you have access
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.7,
        });

        if (!response.data.choices || response.data.choices.length === 0) {
            throw new Error('No response from OpenAI API.');
        }

        const text = response.data.choices[0].message.content.trim();

        // Parse the generated JSON text into a JavaScript object
        const post = parseGeneratedJSON(text);
        console.log("Generated Response:\n", text);

        if (post) {
            // Assign a unique ID to the post
            post.id = generateUniqueId();

            // Save the post as a JSON file
            const filePath = path.join('posts', `post${post.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(post, null, 4));

            // Update posts.json
            updatePostsJson(post);

            console.log('New blog post generated successfully.');
        } else {
            throw new Error('Failed to parse the generated post JSON.');
        }
    } catch (error) {
        console.error('Error generating blog post:', error.message);
        process.exit(1);
    }
})();

function parseGeneratedJSON(text) {
    try {
        // Attempt to parse the text as JSON
        const post = JSON.parse(text);

        // Validate required fields
        if (!post.title || !post.description || !post.content) {
            console.error('Parsing Error: Missing required fields.');
            return null;
        }

        // Ensure date is present and correctly formatted
        if (!post.date || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
            // Set date to current date if missing or invalid
            const currentDate = new Date();
            post.date = currentDate.toISOString().split('T')[0];
        }

        return post;
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
}

function generateUniqueId() {
    return Date.now().toString();
}

function updatePostsJson(newPost) {
    const postsFilePath = path.join('posts', 'posts.json');
    let posts = [];

    if (fs.existsSync(postsFilePath)) {
        const existingPostsData = fs.readFileSync(postsFilePath, 'utf8');
        posts = JSON.parse(existingPostsData);
    }

    // Prepare metadata for posts.json
    const postMeta = {
        id: newPost.id,
        title: newPost.title,
        description: newPost.description,
        date: newPost.date,
    };

    posts.push(postMeta);

    // Sort posts by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 4));
}
