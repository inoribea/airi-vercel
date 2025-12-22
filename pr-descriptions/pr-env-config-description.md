# Feature: Environment Configuration File

## Summary
This PR adds a comprehensive `.env.example` file that contains all environment variables needed for deploying AIRI Stage Web on Vercel or running it locally.

## Details
- Includes environment variables for Vercel deployment
- Contains configurations for various AI providers (OpenAI, Anthropic, Google Gemini, etc.)
- Provides memory system configurations for both short-term and long-term storage
- Organizes variables by category with clear documentation
- Includes fallback configurations and example values

## Changes
- Added `.env.example` with complete environment variable configuration
- Organized variables by functionality (providers, memory, CORS, etc.)
- Added clear documentation for each variable group
- Provided example values and descriptions for all variables

## Testing
1. Verify that all environment variables are properly documented
2. Check that the file is organized in a logical manner
3. Ensure all example values are clearly marked as examples