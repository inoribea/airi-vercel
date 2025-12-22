# Feature: Speech, Hearing, and Image Input Toggle Buttons

## Summary
This PR adds speech, hearing, and image input toggle buttons to the UI, providing users with easy access to these input/output modalities in the AIRI application.

## Details
- Adds toggle buttons for speech synthesis functionality
- Implements hearing/toggle buttons for voice input
- Creates image input toggle for vision capabilities
- Adds image upload functionality with preview
- Provides visual feedback for enabled/disabled states

## Changes
- Modified `apps/stage-web/src/components/Layouts/InteractiveArea.vue` to add toggle buttons
- Updated `apps/stage-web/src/components/Layouts/MobileInteractiveArea.vue` for mobile compatibility
- Added proper icons, tooltips, and visual feedback
- Implemented image upload and preview functionality
- Created proper state management for toggle states

## Testing
1. Verify that speech toggle button works correctly
2. Test hearing/voice input toggle functionality
3. Confirm image input toggle enables upload functionality
4. Ensure mobile layout displays buttons properly
5. Verify visual feedback for enabled/disabled states
6. Test image upload and preview functionality