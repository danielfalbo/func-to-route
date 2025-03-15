import { NextRequest, NextResponse } from "next/server";
import { AuthChecker, noAuth } from "./auth";

export * from "./auth";

export function funcToRoute<FunctionInput, FunctionOutput>(
  f: (_: FunctionInput) => Promise<FunctionOutput>,
  {
    authCheck = noAuth,
    method = "POST",
  }: {
    /**
     * Authentication check function.
     *
     * This function takes a `NextRequest` as an argument and returns an empty object if the request is authenticated, or an object with an `errResponse` property if the request is not authenticated.
     *
     * When the `errResponse` property is present, it should be a `NextResponse` object indicating an error response to be sent back to the client.
     *
     * @param req - The `NextRequest` object.
     * @returns An object with an optional `errResponse` property.
     */
    authCheck?: AuthChecker;
    method?: "GET" | "POST";
  } = {},
) {
  const handler = async (req: NextRequest) => {
    const { errResponse } = authCheck?.(req) ?? {};
    if (errResponse) return errResponse;

    const funcToRouteMethod = method;
    const requestMethod = req.method;

    if (funcToRouteMethod !== requestMethod) {
      return NextResponse.json(
        {
          funcToRouteMethod,
          requestMethod,
          message: "Method mismatch",
        },
        { status: 400 },
      );
    }

    try {
      let body: unknown;

      if (method === "POST") {
        body = await req.json();
      } else {
        // For GET requests, convert URLSearchParams to a plain object
        const params = req.nextUrl.searchParams;
        const obj: Record<string, string> = {};
        params.forEach((value, key) => {
          obj[key] = value;
        });
        body = obj;
      }

      // Let TypeScript handle the type checking through the function signature
      const data = await f(body as FunctionInput);

      return NextResponse.json({ data });
    } catch (error) {
      console.error({ error });

      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ error }, { status: 500 });
      }
    }
  };
  return handler;
}
