# Feature: Environment Variable Handling and CORS Configuration

## Summary
This PR improves environment variable handling and CORS configuration for Vercel deployment, fixing issues with provider health checks and WebSocket connections.

## Details
- Adds logic to skip provider health checks in browser environments to avoid CORS errors
- Implements smart WebSocket URL detection with automatic protocol switching
- Updates CORS configuration to support font loading and API requests
- Improves environment variable validation and fallback behavior
- Adds configuration options for different deployment scenarios

## Changes
- Modified `packages/server-sdk/src/client.ts` to improve WebSocket handling
- Updated `packages/stage-ui/src/stores/providers/openai-compatible-builder.ts` to skip health checks in browser
- Added `eslint.config.ts` with proper configuration
- Updated UnoCSS configuration for local font loading
- Added environment variable handling improvements

## Testing
1. Verify that provider health checks are properly skipped in browser
2. Test WebSocket connections work in different environments
3. Confirm CORS errors are resolved for font loading
4. Ensure environment variable fallbacks work correctly
5. Verify API requests work without CORS issues