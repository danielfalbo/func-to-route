# func-to-route

Are you tired of writing the same boilerplate over and over again to expose internal server functions as API?

Transform any async function into a type-safe API route with built-in auth and error handling with `func-to-route`

Born for Next.js, but feel free to contribute and help implementing it for other frameworks

## Next.js code example

Say you already have a server function like

```typescript
async function getData({ id }: { id: string }): Promise<{ data: string }> {
  return { data: `Item ${id}` };
}
```

and now you want not only to use it internally but also expose it as API.

`func-to-route` saves you from writing the API route boilerplate and gives you the API route in a single line of code like

```typescript
export const GET = funcToRoute(getData, { method: "GET" });
```

which you'll be able to use like `GET /api/data?id=123` out of the box

Boom.

## Features

- 🔒 Built-in token authentication
- 🎯 Type-safe request/response handling
- 🚀 Zero config setup
- ⚡️ Automatic error handling
- 📝 GET/POST support with automatic query/body parsing

  (feel free to open PR implementing the other methods)

## Installation

```bash
npm install func-to-route
# or
yarn add func-to-route
# or
pnpm add func-to-route
```

## Quick Start

```typescript
// somewhere in app/lib/
type Input = { name: string };
type Output = { greeting: string };

async function greet({ name }: Input): Promise<Output> {
  return { greeting: `Hello ${name}!` };
}
```

```typescript
// app/api/hello/route.ts
import { funcToRoute, bearerTokenChecker } from "func-to-route/next";

// Protected route using bearer token auth
export const POST = funcToRoute(greet, {
  authCheck: bearerTokenChecker(SECRET_TOKEN),
});

// Public route with no auth
export const GET = funcToRoute(async () => ({ greeting: "Hello World!" }), {
  method: "GET",
  authCheck: noAuth,
});
```

That's it! Your function is now a fully typed API route with auth and error handling.

## Authentication

The package provides a flexible authentication system:

```typescript
import { bearerTokenChecker } from "func-to-route/next";

// Custom bearer token auth
export const POST = funcToRoute(myFunction, {
  authCheck: bearerTokenChecker(SECRET_TOKEN),
});

// No auth (public route)
export const GET = funcToRoute(myFunction, {
  method: "GET",
  // return empty object for "no error, access guaranteed"
  authCheck: () => ({}),
});

// Custom auth logic
export const POST = funcToRoute(myFunction, {
  authCheck: (req) => {
    // Your auth logic here
    return {}; // or { errResponse: NextResponse.json(...) } for access denied
  },
});
```

## Error Handling

Errors are automatically caught and formatted:

```typescript
async function mightFail(): Promise<void> {
  throw new Error("Something went wrong");
}

export const POST = funcToRoute(mightFail);
// Returns: { error: 'Something went wrong' } with status 500
```

## Type Safety

The function's input/output types are automatically inferred:

```typescript
type User = { id: number; name: string };
type CreateUserInput = { name: string };

async function createUser(input: CreateUserInput): Promise<User> {
  // TypeScript will ensure input has the correct shape
  return { id: 1, name: input.name };
}

export const POST = funcToRoute(createUser);
// Input type is enforced at compile time
// Response type will be { data: User }
```

## Running the Example

The repository includes a complete Next.js example in the `examples/basic-nextjs` directory. To run it:

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/danielfalbo/func-to-route.git
cd func-to-route
npm install
```

2. Build the package:

```bash
npm run build
```

3. Set up the example:

```bash
cd examples/basic-nextjs
npm install
npm link ../../  # Link the local package
```

4. Create a `.env.local` file:

```bash
# examples/basic-nextjs/.env.local
SECRET_TOKEN=your_test_key_here
```

5. Start the development server:

```bash
npm run dev
```

6. Test the endpoints:

Using the UI:

- Open http://localhost:3000
- Try the GET endpoint (no auth required)
- Try the POST endpoint (requires API key)

Using curl:

```bash
# Test GET endpoint (no auth)
curl http://localhost:3000/api/hello

# Test POST endpoint (with auth)
curl -X POST http://localhost:3000/api/hello \
  -H "Authorization: Bearer foobarbaz" \
  -H "Content-Type: application/json" \
  -d '{"name":"Lucia"}'
```

Expected responses:

```json
// GET response
{
  "data": {
    "message": "Hello World!",
    "timestamp": 1234567890
  }
}

// POST success response
{
  "data": {
    "message": "Hello Lucia!",
    "timestamp": 1234567890
  }
}

// POST error response (wrong/missing API key)
{
  "message": "Unauthorized",
  "code": "UNAUTHORIZED",
  "details": {
    "reason": "Invalid or missing bearer token"
  }
}
```

## License

MIT
