// Utility functions for managing cookies in an Express.js application.
// Getoptions function returns an object with default options for setting cookies, including httpOnly, secure, sameSite, and maxAge properties.
// The set function sets a cookie on the response object with the specified name, value, and options. It merges the default options with any additional options provided.
// The clear function clears a cookie on the response object with the specified name and options. It also merges the default options with any additional options provided.
// The get function retrieves the value of a cookie from the request object by its name. It returns the value of the cookie if it exists, or undefined if it does not exist.

export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 mins
  }),
  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },
  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },
  get: (req, name) => {
    return req.cookies[name];
  },
};
