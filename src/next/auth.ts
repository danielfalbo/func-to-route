import { NextRequest, NextResponse } from "next/server";
import {
  AuthChecker as CoreAuthChecker,
  bearerTokenChecker as coreBearerTokenChecker,
  noAuth as coreNoAuth,
} from "../core/auth";

type AuthResponse = { errResponse?: NextResponse };
export type AuthChecker = (req: NextRequest) => AuthResponse;

/**
 * Adapts a framework-agnostic auth checker to work with Next.js
 */
export const adaptAuthChecker =
  (coreChecker: CoreAuthChecker<NextRequest>): AuthChecker =>
  (req: NextRequest): AuthResponse => {
    const result = coreChecker(req);

    if (!result.isAuthorized && result.error) {
      return {
        errResponse: NextResponse.json(result.error.body, {
          status: result.error.status,
        }),
      };
    }

    return {};
  };

/**
 * Creates a bearer token authentication checker.
 *
 * @param token - The token to validate against
 * @returns An AuthChecker function that validates the Authorization header against the provided token
 *
 * @example
 * ```typescript
 * // API key auth
 * authCheck: bearerTokenChecker(SECRET_TOKEN)
 *
 * // Custom token auth
 * authCheck: bearerTokenChecker(MY_CUSTOM_TOKEN)
 * ```
 */
export const bearerTokenChecker = (token: string): AuthChecker =>
  adaptAuthChecker(coreBearerTokenChecker(token));

/**
 * No authentication checker. Makes the route public.
 *
 * @example
 * ```typescript
 * authCheck: noAuth
 * ```
 */
export const noAuth: AuthChecker = adaptAuthChecker(coreNoAuth);
