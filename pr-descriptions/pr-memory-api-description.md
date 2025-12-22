# Feature: Serverless Memory API Functions

## Summary
This PR adds serverless memory API functions and memory system package to provide both short-term and long-term memory capabilities for AIRI.

## Details
- Implements serverless functions for memory operations (save, search, clear)
- Provides support for multiple memory providers (Vercel KV, Upstash Redis, PostgreSQL with pgvector, Qdrant)
- Adds memory embedding functionality with support for OpenAI and Cloudflare embeddings
- Creates a unified memory system package with provider abstraction
- Includes migration scripts for database setup

## Changes
- Added serverless API functions in `api/memory/` directory
- Created `packages/memory/` with memory system implementation
- Implemented support for short-term and long-term memory storage
- Added embedding capabilities with multiple provider options
- Included configuration and type definitions for memory system

## Testing
1. Verify that memory save API endpoint works correctly
2. Test memory search functionality with different providers
3. Confirm short-term memory operations (Vercel KV, Upstash Redis)
4. Verify long-term memory operations (PostgreSQL, Qdrant)
5. Test embedding functionality with various providers