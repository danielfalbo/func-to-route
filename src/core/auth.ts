/**
 * Standard error response body structure
 */
export type ErrorBody = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

/**
 * Generic error response type that can be adapted by different frameworks
 */
export type ErrorResponse = {
  status: number;
  body: ErrorBody;
};

/**
 * Framework-agnostic auth checker type
 */
export type AuthResult = {
  isAuthorized: boolean;
  error?: ErrorResponse;
};

/**
 * Framework-agnostic request interface
 */
export interface Request {
  headers: {
    get(name: string): string | null;
  };
}

/**
 * Framework-agnostic auth checker type
 */
export type AuthChecker<TRequest extends Request = Request> = (
  req: TRequest,
) => AuthResult;

/**
 * Creates a bearer token authentication checker.
 *
 * @param token - The token to validate against
 * @returns An AuthChecker function that validates the Authorization header against the provided token
 *
 * @example
 * ```typescript
 * // API key auth
 * authCheck: bearerTokenChecker(process.env.SECRET_TOKEN)
 *
 * // Custom token auth
 * authCheck: bearerTokenChecker(process.env.MY_CUSTOM_TOKEN)
 * ```
 */
export const bearerTokenChecker = <TRequest extends Request>(
  token: string,
): AuthChecker<TRequest> => {
  return (req: TRequest) => {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${token}`) {
      return {
        isAuthorized: false,
        error: {
          status: 401,
          body: {
            message: "Unauthorized",
            code: "UNAUTHORIZED",
            details: {
              reason: "Invalid or missing bearer token",
            },
          },
        },
      };
    }

    return { isAuthorized: true };
  };
};

/**
 * No authentication checker. Makes the route public.
 *
 * @example
 * ```typescript
 * authCheck: noAuth
 * ```
 */
export const noAuth: AuthChecker = () => ({ isAuthorized: true });
