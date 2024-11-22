import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import { join } from 'path';
import { readFile } from 'fs/promises';

dotenv.config();

const skipRequest = false;

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
]
  
It's very important that you place all explanation at the beginning of the file, include code examples that correspond to a specific bug with the line of code that the error is about, and end the message with the analysis JSON.

`
const fakeResponse = `Here are the accessibility issues I identified in the provided code changes:

Explanation:
The DisabledButton component uses CSS opacity and pointerEvents to visually disable the button when isLoading is true. This is problematic because it makes the button appear non-interactive to sighted users, but it's still focusable and operable via keyboard or screen reader. It fails WCAG 2.1.1 Keyboard criteria.

The Modal component traps keyboard focus inside the modal when opened. However, it doesn't provide a way to close the modal using the keyboard, violating WCAG 2.1.2 No Keyboard Trap. The close button should be focusable and operable with the keyboard.

The Form component has multiple accessibility issues:
1. The input fields are missing associated labels, failing WCAG 1.3.1 Info and Relationships and 2.4.6 Headings and Labels.
2. The name error message is hidden using display: none, making it inaccessible to screen readers. It should use techniques like aria-live or role="alert" to announce the error.
3. The email field is missing an error message and indicator for invalid input.
4. The form is missing a submit button, and instead uses an onClick handler on a regular button. This fails WCAG 3.2.2 On Input as the form won't be submittable using the Enter key.

Here are the specific issues with suggested fixes:

[
  {
    "location": "src/DisabledButton.jsx:3",
    "content": "Using CSS opacity and pointerEvents to visually disable a button is problematic. It makes the button appear non-interactive to sighted users, but it's still focusable and operable via keyboard or screen reader. This fails WCAG 2.1.1 Keyboard. To fix, add the disabled attribute to truly disable the button: <button type="submit" disabled={isLoading}>."
  },
  {
    "location": "src/Modal.jsx:16",
    "content": "The modal close button is not keyboard accessible, violating WCAG 2.1.2 No Keyboard Trap. To fix, make the close button focusable and operable with the keyboard, for example: <button type=\"button\" onClick={() => isOpen(false)}>×</button>."
  },
  {
    "location": "src/Form.jsx:4",
    "content": "The name input is missing a programmatically associated label, failing WCAG 1.3.1 Info and Relationships and 2.4.6 Headings and Labels. To fix, add a <label> with a for attribute referencing the input's id: <label for=\"name\">Name</label> <input type=\"text\" id=\"name\" />."
  },
  {
    "location": "src/Form.jsx:7",
    "content": "The name error message is hidden with display:none, making it permanently inaccessible to screen readers. Use aria-live or role=\"alert\" to announce the error when it appears. For example: <div aria-live=\"assertive\" style={{color: 'red'}}>Name is required</div>."
  },
  {
    "location": "src/Form.jsx:11",
    "content": "The email input is missing an error message for invalid input. Add a conditional error similar to the name field to indicate when the entered email is invalid."
  },
  {
    "location": "src/Form.jsx:13",
    "content": "The form uses an onClick handler on a button instead of an onSubmit handler on the <form>. This fails WCAG 3.2.2 On Input as the form is not submittable via keyboard by pressing Enter. To fix, use a submit button: <button type=\"submit\">Send</button> and handle the submit event on the form."
  }
]

Let me know if you have any other questions!`
// Load prompt when server starts
// loadPrompt('accessibility-prompt.txt')
//   .then(prompt => {
//     accessibilityPrompt = prompt;
//     // console.log('Loaded accessibility prompt\n', accessibilityPrompt);
//   })
//   .catch(error => {
//     console.error('Failed to load accessibility prompt:', error);
//   });

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