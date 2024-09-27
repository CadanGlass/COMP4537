// app.js

const http = require("http"); // Import the http module
const url = require("url"); // Import the url module to parse query strings

const PORT = 3000; // Define the port number

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the request URL
  const pathName = parsedUrl.pathname; // Get the pathname (the part of the URL after the domain)
  const query = parsedUrl.query; // Get the query parameters
  const name = query.name || "Cadan"; // Get the 'name' query parameter, or default to 'Guest'
 const { getDate } = require("./modules/utils");
  const { greetingMessage } = require("./lang/en"); // Import the message from messages.js
  // Check if the request matches the desired endpoint
  if (pathName === "/COMP4537/labs/3/getDate/" && req.method === "GET") {
    const currentDate = new Date(); // Get the current server date and time
    const message = greetingMessage.replace("%1", name) + ` ${currentDate}`;

    // Set response headers for HTML content
    res.writeHead(200, { "Content-Type": "text/html" });

    // Send the HTML response with the message in blue color
    res.end(`
            <html>
                <body style="color: blue;">
                    <p>${message}</p>
                </body>
            </html>
        `);
  } else {
    // Handle 404 errors for unknown routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
