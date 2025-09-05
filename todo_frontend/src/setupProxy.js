"use strict";

/**
 * Development proxy configuration for Create React App.
 * Forwards all requests starting with /api to the backend server and strips the /api prefix.
 *
 * Environment variables:
 * - REACT_APP_PROXY_TARGET (preferred): Full URL of the backend API, e.g. https://vscode-internal-31796-beta.beta01.cloud.kavia.ai:3001
 * - REACT_APP_API_BASE_URL: Fallback if REACT_APP_PROXY_TARGET is not set.
 *
 * Example:
 *   REACT_APP_PROXY_TARGET=https://localhost:3001
 *   /api/auth/login -> https://localhost:3001/auth/login
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target =
    process.env.REACT_APP_PROXY_TARGET || process.env.REACT_APP_API_BASE_URL;

  if (!target) {
    // eslint-disable-next-line no-console
    console.warn(
      "[setupProxy] No REACT_APP_PROXY_TARGET or REACT_APP_API_BASE_URL set. " +
        "Calls to /api/* will hit the CRA server and likely return 404. " +
        "Set REACT_APP_PROXY_TARGET to your backend URL for local development."
    );
    return;
  }

  // Proxy /api/* to the backend, removing the /api prefix
  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false, // allow self-signed certs if using https in dev
      pathRewrite: {
        "^/api": "",
      },
      logLevel: "warn",
    })
  );
};
