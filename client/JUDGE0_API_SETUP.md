# Judge0 API Setup Instructions

## Overview
This code editor uses the Judge0 API via RapidAPI to execute code. Follow these steps to set up the API integration.

## Step 1: Get RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in to your account
3. Search for "Judge0 CE" (Community Edition)
4. Subscribe to the Judge0 CE API (free tier available)
5. Copy your RapidAPI key from the dashboard

## Step 2: Update Environment Variables

Open the `.env` file in the client directory and update:

```bash
VITE_RAPID_API_KEY=YOUR_ACTUAL_RAPIDAPI_KEY_HERE
```

Replace `YOUR_RAPIDAPI_KEY_HERE` with your actual RapidAPI key.

## Step 3: Verify Configuration

The other environment variables should already be set:

```bash
VITE_RAPID_API_URL=https://judge0-ce.p.rapidapi.com/submissions
VITE_RAPID_API_HOST=judge0-ce.p.rapidapi.com
```

## Step 4: Test the Code Editor

1. Start the development server: `npm run dev`
2. Navigate to the code editor page (`/code`)
3. Write some code and click "Compile and Execute"
4. Check the output panel for results

## Fallback Mode

If the API is not configured, the application will use mock data to simulate code execution, so you can still test the UI functionality.

## Supported Languages

The Judge0 API supports many programming languages including:
- JavaScript (Node.js)
- Python
- Java
- C++
- C
- C#
- Go
- Rust
- And many more...

## API Rate Limits

- Free tier: Usually 100 requests per day
- Check your RapidAPI dashboard for current usage
- Consider upgrading if you need higher limits

## Troubleshooting

1. **"API environment variables not set"**: Check your `.env` file
2. **"Quota exceeded"**: You've hit the daily rate limit
3. **Network errors**: Check your internet connection and API key
4. **No output**: Check the browser console for error messages

## Security Note

Never commit your actual API key to version control. The `.env` file should be in your `.gitignore`.
