import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';



dotenv.config();

const app = express();
app.use(cors());
// Increase payload limit to handle large patches
app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to process git patches
const processPatch = (patch) => {
  if (!patch.content || !patch.filename) {
    throw new Error('Each patch must have content and filename');
  }
  
  return `File: ${patch.filename}\n${patch.content}\n---\n`;
};

// Helper function to format multiple patches for Claude
const formatPatches = (patches) => {
  return patches
    .map(processPatch)
    .join('\n');
};

// Helper function to extract line numbers and messages
const processResponse = (response) => {
  const lines = response.split('\n');
  return lines.map((line, index) => ({
    lineNumber: index + 1,
    content: line
  }));
};

// Accessibility-focused system prompt
const accessibilitySystemPrompt = `You are an expert accessibility consultant analyzing code changes. Focus on:
1. ARIA attributes and roles
2. Semantic HTML usage
3. Keyboard navigation and focus management
4. Color contrast and visual considerations
5. Screen reader compatibility
6. Touch target sizes and mobile accessibility
7. Error states and form validation
8. Dynamic content updates
9. Compliance with WCAG 2.1 AA standards

Provide specific, actionable feedback with code examples when relevant. If you identify issues, suggest fixes that follow accessibility best practices.`;

// Specialized endpoint for accessibility reviews
app.post('/analyze-patches/accessibility', async (req, res) => {
  try {
    const { 
      patches,      // Array of { filename: string, content: string }
      prompt,       // User's question or request
      maxTokens = 4096 
    } = req.body;

    if (!Array.isArray(patches)) {
      throw new Error('Patches must be provided as an array');
    }

    // Format patches for Claude
    const formattedPatches = formatPatches(patches);

    // Construct the message with patches and prompt, focusing on accessibility
    const enhancedPrompt = `Here are the git patches to analyze for accessibility:\n\n${formattedPatches}\n\nAnalyze these changes for accessibility concerns and best practices. Consider ARIA usage, semantic HTML, keyboard navigation, and screen reader compatibility.\n\nAdditional question/request: ${prompt || 'Provide a comprehensive accessibility review.'}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: enhancedPrompt
      }],
      system: accessibilitySystemPrompt
    });

    const processedResponse = processResponse(message.content[0].text);

    res.json({
      success: true,
      response: processedResponse
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Main endpoint to handle Claude requests with git patches
app.post('/analyze-patches', async (req, res) => {
  try {
    const { 
      patches,      // Array of { filename: string, content: string }
      prompt,       // User's question or request
      systemPrompt = "You are a helpful assistant analyzing git patches.", 
      maxTokens = 4096 
    } = req.body;

    if (!Array.isArray(patches)) {
      throw new Error('Patches must be provided as an array');
    }

    // Format patches for Claude
    const formattedPatches = formatPatches(patches);

    // Construct the message with patches and prompt
    const enhancedPrompt = `Here are the git patches to analyze:\n\n${formattedPatches}\n\nQuestion/Request: ${prompt}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: enhancedPrompt
      }],
      system: systemPrompt
    });

    const processedResponse = processResponse(message.content[0].text);

    res.json({
      success: true,
      response: processedResponse
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});