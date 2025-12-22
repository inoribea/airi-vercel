# Feature: Memory System Frontend Components

## Summary
This PR adds memory system frontend components and settings UI to allow users to configure and manage memory settings in the AIRI application.

## Details
- Adds memory store implementation for frontend state management
- Creates memory settings page with UI components for configuration
- Implements memory provider selection and configuration
- Adds UI components for short-term and long-term memory configuration
- Provides configuration options for embedding providers

## Changes
- Added `packages/stage-ui/src/stores/memory.ts` for memory state management
- Created memory settings components in `packages/stage-pages/src/pages/settings/memory/`
- Implemented embedding configuration UI
- Added memory provider configuration options
- Created overview components for memory management

## Testing
1. Verify that memory settings page renders correctly
2. Test memory provider selection functionality
3. Confirm embedding configuration options work properly
4. Verify short-term and long-term memory configuration UI
5. Ensure all memory-related settings are properly saved and applied