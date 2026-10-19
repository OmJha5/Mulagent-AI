import proxy from "express-http-proxy";
import { type Request } from "express";

/**
 * Creates a reverse proxy middleware that injects the authenticated user's ID
 * into the forwarded request headers ('x-user-id').
 *
 * @param targetUrl - The target microservice URL
 */
export const createAuthenticatedProxy = (targetUrl: string) => {
  return proxy(targetUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq: Request) => {
      if (!proxyReqOpts.headers) {
        proxyReqOpts.headers = {};
      }
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
  });
};
