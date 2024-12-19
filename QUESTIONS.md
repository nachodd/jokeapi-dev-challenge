# Questions

1. What's a closure? Where in the code is there a closure?
A closure is a construct in which a function is paired with references to its surrounding lexical environment, effectively encapsulating both the function and its external context. This mechanism allows the function to access variables from its outer scope. In JavaScript, closures are inherently formed whenever a function is defined, as part of the function creation process.
An example of a closure in my code can be found in the file `apps/backend/handler.js` on the `getPaginatedJokes` method. The closure is the arrow function assigned to the `sortedJokes` variable. The function captures the `sortBy` and `sortOrder` variables from its surrounding scope.

2. Which are the potential side-effects in any function? Could you point out any of these cases in your code? Are they expected? Can they be avoided?
Potential side effects can include for instance asynchronous data fetching in `useJokes` composable (`apps/frontend/src/composables/useJokes.ts`). The `fetchJokes` function makes asynchronous calls to `JokeService`. Although, this is an expected side-effect as fetching data from an API is inherently asynchronous. In this case it's not avoidable, but I can mitigate potential issues by using proper error handling and/or state management.
Other potential side effects could be a function that modifies a global variable. For example, the following generic example:

```javascript
let globalVariable = 0;

function incrementGlobalVariable() {
  globalVariable += 1;
  return globalVariable;
}
```

On how to avoid this type of side-effects:

- Use pure functions: Functions that do not modify any external state and return the same output given the same input.
- Use local state: Encapsulate state within the function or object to avoid global state modifications.
- Use Immutable Data Structures: Use immutable data structures to avoid unintended state changes.

An example of something similar like this could be found on the `useJokes.ts` file in the `apps/frontend/src/composables/` directory, where the state for the jokes is being modified directly on the `updateLocalJokes` function.
