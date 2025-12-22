# Feature: Vercel Deployment Configuration

## Summary
This PR adds Vercel deployment configuration with SPA rewrites and API setup to enable proper deployment of AIRI to Vercel.

## Details
- Adds `vercel.json` configuration file for Vercel deployment
- Configures SPA rewrites to handle client-side routing properly
- Sets up API functions with proper runtime and CORS configuration
- Includes build command optimization for monorepo structure
- Adds CORS headers to allow cross-origin requests

## Changes
- Added `vercel.json` with complete Vercel configuration
- Configured SPA rewrite rules to support client-side routing
- Set up API functions with Node.js runtime
- Added CORS headers for fonts and API endpoints
- Included environment variable configuration for deployment

## Testing
1. Verify that Vercel deployment works with the new configuration
2. Test SPA routing functionality to ensure client-side navigation works
3. Confirm API functions are properly configured and accessible
4. Ensure CORS headers are correctly applied to prevent CORS issues