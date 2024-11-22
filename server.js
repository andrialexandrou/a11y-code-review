import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import { join } from 'path';
import { readFile } from 'fs/promises';
import fakeResponse from './fake-response.json' assert { type: 'json' };

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Read prompt from file
async function loadPrompt(filename) {
  try {
    const path = join(process.cwd(), filename);
    const prompt = await readFile(path, 'utf-8');
    return prompt;
  } catch (error) {
    console.error(`Error loading prompt from ${filename}:`, error);
    return ''; // Return empty string as fallback
  }
}

let accessibilityPrompt = `You are an expert accessibility consultant analyzing code changes. Focus on:
1. ARIA attributes and roles
2. Semantic HTML usage
3. Keyboard navigation and focus management
4. Color contrast and visual considerations
5. Screen reader compatibility
6. Touch target sizes and mobile accessibility
7. Error states and form validation
8. Dynamic content updates
9. Compliance with WCAG 2.1 AA standards

Provide specific, actionable feedback with code examples when relevant. If you identify issues, suggest fixes that follow accessibility best practices.;

Please analyze these changes for accessibility issues. For each issue:
1. Explain why it's a problem
2. Who it affects and how
3. Suggest a specific fix with example code
4. Reference relevant WCAG criteria where applicable;

Focus specifically on keyboard accessibility issues. Check for:
- Keyboard focus trapping in modals
- Focus management after dynamic updates
- Proper tab order
- Keyboard event handling;

Focus specifically on screen reader compatibility. Check for:
- Proper ARIA attributes
- Semantic HTML structure
- Text alternatives
- Status announcement;

Focus specifically on error handling and form validation accessibility. Check for:
- Error message associations
- Status announcements
- Clear error indicators
- Recovery suggestions

In your response, provide a JSON object the location is string pattern "filename.path:linenumber"
for instance "my-function.js:67" and the a11y message is in the content. The full JSON object will look like

[
  {
    location: "src/DisabledButton.jsx:2",
    content: "Using CSS opacity and pointerEvents to visually disable a button is problematic. It makes the button appear non-interactive to sighted users, but it's still focusable and operable via keyboard or screen reader. This fails WCAG 2.1.1 Keyboard. To fix, add the disabled attribute to truly disable the button: <button type=\\"submit\\" disabled={isLoading}>."
  },
]`

// Load prompt when server starts
loadPrompt('accessibility-prompt.txt')
  .then(prompt => {
    accessibilityPrompt = prompt;
    // console.log('Loaded accessibility prompt\n', accessibilityPrompt);
  })
  .catch(error => {
    console.error('Failed to load accessibility prompt:', error);
  });

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  if (req.body) {
    console.log('Request body overview:', {
      promptLength: req.body.prompt?.length || 0,
      numPatches: req.body.patches?.length || 0,
      patches: req.body.patches?.map(p => ({
        filename: p.filename,
        contentLength: p.content?.length || 0
      }))
    });
  }
  next();
});

// Helper function to process git patches
const processPatch = (patch) => {
  console.log(`Processing patch for file: ${patch.filename}`);
  console.log(`Patch content length: ${patch.content?.length || 0} characters`);
  
  if (!patch.content || !patch.filename) {
    console.warn('Invalid patch:', patch);
    throw new Error('Each patch must have content and filename');
  }
  
  return `File: ${patch.filename}\n${patch.content}\n---\n`;
};

// Helper function to format multiple patches for Claude
const formatPatches = (patches) => {
  console.log(`Formatting ${patches.length} patches`);
  return patches
    .map(processPatch)
    .join('\n');
};

// Helper function to extract line numbers and messages
const processResponse = (response) => {
  return response
  console.log('Processing Claude response length:', response.length);
  const lines = response.split('\n');
  return lines.map((line, index) => ({
    lineNumber: index + 1,
    content: line
  }));
};

// Main endpoint to handle Claude requests with git patches
app.post('/analyze-patches', async (req, res) => {
  console.log('\n=== Starting new analysis request ===');
  try {
    const { 
      patches,
      prompt,
      systemPrompt = "You are a helpful assistant analyzing git patches.", 
      maxTokens = 4096 
    } = req.body;

    if (!Array.isArray(patches)) {
      console.error('Invalid patches format:', patches);
      throw new Error('Patches must be provided as an array');
    }

    console.log(`Received ${patches.length} patches to analyze`);
    const formattedPatches = formatPatches(patches);
    console.log('Total formatted patches length:', formattedPatches.length);

    const enhancedPrompt = `Here are the git patches to analyze:\n\n${formattedPatches}\n\nQuestion/Request: ${prompt}`;
    console.log('Enhanced prompt', enhancedPrompt);

    console.log('Making request to Claude API...');
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: enhancedPrompt
      }],
      system: systemPrompt
    });
    console.log('Received response from Claude API');

    const processedResponse = processResponse(message.content[0].text);

    res.json({
      success: true,
      response: processedResponse
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Accessibility-focused endpoint
app.post('/analyze-patches/accessibility', async (req, res) => {
  console.log('\n=== Starting new accessibility analysis request ===');
  try {
    const { 
      patches,
      prompt,
      systemPrompt = "You are a helpful assistant analyzing git patches.", 
      maxTokens = 4096 
    } = req.body;

    if (!Array.isArray(patches)) {
      console.error('Invalid patches format:', patches);
      throw new Error('Patches must be provided as an array');
    }

    console.log(`Received ${patches.length} patches to analyze`);
    const formattedPatches = formatPatches(patches);
    console.log('Total formatted patches length:', formattedPatches.length);

    const enhancedPrompt = `${accessibilityPrompt}\nHere are the git patches to analyze:\n\n${formattedPatches}\n\nQuestion/Request: ${prompt}`;
    console.log('Enhanced prompt:', enhancedPrompt);

    console.log('Making request to Claude API...');

    const skipRequest = false;
    if (skipRequest) {
      res.json({
        success: true,
        response: fakeResponse
      });
    } else {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: maxTokens,
        messages: [{
          role: 'user',
          content: enhancedPrompt
        }],
        system: systemPrompt
      });
      console.log('Received response from Claude API');
  
      const processedResponse = processResponse(message.content[0].text);
      console.log('Processed response into\n', processedResponse);
  
      res.json({
        success: true,
        response: processedResponse
      });

    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint with basic diagnostics
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    anthropicConfigured: !!process.env.ANTHROPIC_API_KEY
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Debug logging enabled');
  console.log('ANTHROPIC_API_KEY configured:', !!process.env.ANTHROPIC_API_KEY);
});