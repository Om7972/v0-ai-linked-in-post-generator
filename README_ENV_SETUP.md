# Environment Variables Setup

## Required Environment Variables

To use the Gemini AI API for generating LinkedIn posts and JWT authentication, you need to set up the following environment variables:

### GEMINI_API_KEY

1. **Get your API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Set up the environment variable:**
   
   Create a `.env.local` file in the root of your project:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   Or use the alternative variable name (for compatibility):
   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```

### JWT_SECRET (Optional but Recommended)

For production, set a secure JWT secret:

```bash
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

**Note:** If not set, a default secret will be used (not recommended for production).

3. **Restart your development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Environment File Structure

- `.env.local` - Your local environment variables (not committed to git)
- `.env.example` - Example file showing required variables (committed to git)

## Security Notes

- ⚠️ **Never commit your `.env.local` file to git**
- ✅ The `.env.local` file is already in `.gitignore`
- ✅ Use `.env.example` to document required variables
- ✅ Keep your API keys secure and don't share them publicly

## Troubleshooting

If you see an error about missing API key:
1. Check that `.env.local` exists in the project root
2. Verify the variable name is exactly `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
3. Make sure there are no spaces around the `=` sign
4. Restart your development server after creating/modifying `.env.local`

