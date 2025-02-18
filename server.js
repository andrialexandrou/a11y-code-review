import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import { generatePrompt } from './accessibility-prompt.js';

dotenv.config();

const skipRequest = false;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
  // Return the raw response text from Claude
  return response;
};

// Accessibility-focused endpoint
app.post('/analyze-patches/accessibility', async (req, res) => {
  console.log('\n=== Starting new accessibility analysis request ===');
  try {
    const { 
      patches,
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

    const accessibilityPrompt = generatePrompt(formattedPatches);
    console.log('Generated accessibility prompt:\n', accessibilityPrompt);

    console.log('Making request to Claude API...');

    if (skipRequest) {
      console.log('Skipping request to Claude API');
      res.json({
        success: true,
        response: processResponse(fakeResponse)
      });
    } else {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: maxTokens,
        messages: [{
          role: 'user',
          content: accessibilityPrompt
        }],
        system: systemPrompt
      });
      console.log('Received response from Claude API');

      // Update how we get the response content
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