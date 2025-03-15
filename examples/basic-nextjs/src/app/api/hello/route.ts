import { funcToRoute, bearerTokenChecker, noAuth } from "@/lib/func-to-route";

type GreetInput = {
  name: string;
};

type GreetOutput = {
  message: string;
  timestamp: number;
};

async function greet({ name }: GreetInput): Promise<GreetOutput> {
  return {
    message: `Hello ${name}!`,
    timestamp: Date.now(),
  };
}

// Example with API key auth using the generic bearer token checker
export const POST = funcToRoute(greet, {
  authCheck: bearerTokenChecker(process.env.SECRET_TOKEN ?? ""),
});

// Example with no auth
export const GET = funcToRoute(
  async () => ({ message: "Hello World!", timestamp: Date.now() }),
  { method: "GET", authCheck: noAuth },
);
