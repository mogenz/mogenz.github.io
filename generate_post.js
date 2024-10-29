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
You are an AI language model that writes insightful and engaging blog posts about anything you want. Generate a blog post with the following structure, using exact section headings as specified (do not include any additional formatting like '**', '*', '_', '#', '##', or any Markdown or HTML tags in the headings):

Title:
[A catchy and descriptive title about a topic in AI.]

Description:
[A short summary of the blog post.]

Content:
[Detailed content of the blog post, including an introduction, unique insights, main sections, and conclusion. Use appropriate HTML tags like <h2>, <p>, <ul>, <li>, etc.]

Date:
[Provide a date in YYYY-MM-DD format.]
        `;

        // Generate the blog post using OpenAI's chat completion
        const response = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.7,
        });

        if (!response.data.choices || response.data.choices.length === 0) {
            throw new Error('No response from OpenAI API.');
        }

        const text = response.data.choices[0].message.content.trim();

        // Parse the generated text into a JSON object
        const post = parseGeneratedText(text);
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
    let currentSection = null;

    lines.forEach(line => {
        // Remove any leading formatting characters and whitespace
        const cleanLine = line.replace(/^[\s#\*\_]+/, '').trim();

        if (/^Title:/i.test(cleanLine)) {
            currentSection = 'title';
            post.title = cleanLine.replace(/^Title:/i, '').trim();
        } else if (/^Description:/i.test(cleanLine)) {
            currentSection = 'description';
            post.description = cleanLine.replace(/^Description:/i, '').trim();
        } else if (/^Content:/i.test(cleanLine)) {
            currentSection = 'content';
            post.content = cleanLine.replace(/^Content:/i, '').trim();
        } else if (/^Date:/i.test(cleanLine)) {
            currentSection = 'date';
            post.date = cleanLine.replace(/^Date:/i, '').trim();
        } else if (currentSection) {
            // Append the line to the current section
            post[currentSection] += '\n' + line.trim();
        }
    });

    // Trim leading/trailing whitespace
    ['title', 'description', 'content', 'date'].forEach(field => {
        if (post[field]) {
            post[field] = post[field].trim();
        }
    });

    // If the date is missing, set it to the current date
    if (!post.date || post.date.trim() === '') {
        const currentDate = new Date();
        post.date = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    // Validate required fields
    return post.title && post.description && post.content ? post : null;
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
