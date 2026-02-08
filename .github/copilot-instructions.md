# GitHub Copilot Instructions

The project is split in the folder `src` for the React application and `functions` for the Firebase Cloud Functions, both using typescript.

When suggesting code:
- Always use TypeScript with proper type definitions
- Prefer `Dictionary` type from common types over Record<string, T> for object types
- Use functional React components with hooks, not class components
- Follow existing patterns for Firebase data operations
- Include JSDoc comments for functions with complex logic. Don't add types or examples to docstring, JSDoc.
- For component props, add comments for each prop
- Use Ant Design components for UI elements
- Consider performance with useMemo/useCallback where appropriate
- Leverage existing utility functions from the codebase
- Use lodash utility functions for common operations, but import the specific functions you need directly, not via `_`

## React component structure preferences:
- Export named components, not default exports
- Place hooks at the top of components
- Extract complex logic to helper functions
- Prefer types over interfaces
- Always have a proper type block for component props
- Do not use any, infer types where possible
- Component props should always have the comment describing the prop, even if it's self-explanatory. This is for better documentation and understanding of the codebase.



## JSDoc Formatting Rules
When generating JSDoc comments for React props or TypeScript interfaces, ALWAYS use the multi-line block format:

/**
 * Description goes here.
 */

Do NOT use single-line comments like: /** Description */
