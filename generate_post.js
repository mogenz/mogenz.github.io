import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set. Please add it to your environment variables.');
        }

        const prompt = `
You are an AI language model that writes insightful and engaging blog posts about anything you want. Generate a blog post with the following exact structure and headings (do not include any extra characters or formatting):

Title:
[Title here]

Description:
[Description here]

Content:
[Content here]

Date:
[YYYY-MM-DD]
        `;

        const response = await callOpenAIWithRetry(prompt);

        // Log the full response structure to verify contents
        console.log("Full Response Object:", JSON.stringify(response, null, 2));

        if (!response || !response.choices || response.choices.length === 0) {
            console.error("Unexpected API response structure. 'choices' is missing.");
            throw new Error('No response from OpenAI API.');
        }

        const text = response.choices[0].message.content.trim();
        const post = parseGeneratedText(text);

        console.log("Generated Response:\n", text);

        if (post) {
            post.id = generateUniqueId();
            const filePath = path.join('posts', `post${post.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(post, null, 4));
            await updatePostsJson(post);
            console.log('New blog post generated successfully.');
        } else {
            throw new Error('Failed to parse the generated post.');
        }
    } catch (error) {
        console.error('Error generating blog post:', error.message);
        process.exit(1);
    }
})();

async function callOpenAIWithRetry(prompt, retries = 3) {
    let attempts = 0;
    while (attempts < retries) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.7,
            });
            return response;
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed: ${error.message}`);
            if (attempts >= retries) {
                throw new Error("Max retries reached. Could not get a response from OpenAI.");
            }
            await new Promise(res => setTimeout(res, 2000));
        }
    }
}

function parseGeneratedText(text) {
    console.log("Raw generated text:", text); // Log the raw generated response for debugging

    const post = {};
    let currentSection = null;
    const lines = text.split('\n').filter(line => line.trim() !== '');

    lines.forEach(line => {
        if (line.toLowerCase().startsWith('title:')) {
            currentSection = 'title';
            post.title = line.replace(/title:/i, '').trim();
        } else if (line.toLowerCase().startsWith('description:')) {
            currentSection = 'description';
            post.description = line.replace(/description:/i, '').trim();
        } else if (line.toLowerCase().startsWith('content:')) {
            currentSection = 'content';
            post.content = line.replace(/content:/i, '').trim();
        } else if (line.toLowerCase().startsWith('date:')) {
            currentSection = 'date';
            post.date = line.replace(/date:/i, '').trim();
        } else if (currentSection) {
            // Accumulate additional lines under the current section
            post[currentSection] = (post[currentSection] || '') + '\n' + line;
        }
    });

    // Trim whitespace from each field if present
    for (const key of ['title', 'description', 'content', 'date']) {
        if (post[key]) post[key] = post[key].trim();
    }

    // Final validation to ensure all required fields are present
    if (!post.date) {
        post.date = new Date().toISOString().split('T')[0]; // Default to today's date if missing
    }

    if (!post.title) {
        console.error('Parsing Error: Title not found.');
    }
    if (!post.description) {
        console.error('Parsing Error: Description not found.');
    }
    if (!post.content) {
        console.error('Parsing Error: Content not found.');
    }

    return post.title && post.description && post.content ? post : null;
}

    // Validate required fields
    return post.title && post.description && post.content ? post : null;
}




function generateUniqueId() {
    return Date.now().toString();
}

async function updatePostsJson(newPost) {
    const postsFilePath = path.join('posts', 'posts.json');
    let posts = [];

    if (fs.existsSync(postsFilePath)) {
        const existingPostsData = fs.readFileSync(postsFilePath, 'utf8');
        posts = JSON.parse(existingPostsData);
    }

    posts.push({
        id: newPost.id,
        title: newPost.title,
        description: newPost.description,
        content: newPost.content,
        date: newPost.date,
    });

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 4));
}
