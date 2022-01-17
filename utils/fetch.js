const nodeFetch = require("node-fetch");
const qs = require("querystring");

async function fetch(url, { method = "GET", headers = {}, body, query } = {}) {
  if (query) {
    query = qs.stringify(query);
    url = `${url}?${query}`;
  }
  headers = {
    "user-agent": "Mozilla/5.0",
    ...headers,
  };
  const response = await nodeFetch(url, {
    method,
    headers,
    body: body && JSON.stringify(body),
  });
  const result = await response.json();
  return result;
}

module.exports = {
  fetch,
};
