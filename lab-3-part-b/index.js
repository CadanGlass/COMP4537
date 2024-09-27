// app.js

const http = require("http"); // Import the http module
const url = require("url"); // Import the url module to parse query strings
const fs = require("fs"); // Import the fs module for file operations
const path = require("path"); // Import the path module for handling file paths

const PORT = 3000; // Define the port number

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the request URL
  const pathname = parsedUrl.pathname; // Get the pathname (the part of the URL after the domain)
  const query = parsedUrl.query; // Get the query parameters

  // Endpoint 1: Get current date and time
  if (pathname === "/COMP4537/labs/3/getDate/" && req.method === "GET") {
    const name = query.name || "Guest"; // Get the 'name' query parameter, or default to 'Guest'
    const currentDate = new Date(); // Get the current server date and time
    const greetingMessage = "Hello %1! The current date and time is:"; // Define the greeting message
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
  }
  // Endpoint 2: Write to a file
  else if (pathname === "/COMP4537/labs/3/writeFile/" && req.method === "GET") {
    const text = query.text;
    const filePath = path.join(__dirname, "file.txt");

    if (!text) {
      res.statusCode = 400; // Bad Request
      res.setHeader("Content-Type", "text/plain");
      res.end('Bad Request: "text" query parameter is required.');
      return;
    }

    fs.appendFile(filePath, text + "\n", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.statusCode = 500; // Internal Server Error
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal Server Error: Could not write to file.");
        return;
      }

      res.statusCode = 200; // OK
      res.setHeader("Content-Type", "text/plain");
      res.end(`Text "${text}" has been appended to file.txt`);
    });
  }
  // Endpoint 3: Read from a file
  else if (
    pathname.startsWith("/COMP4537/labs/3/readFile/") &&
    req.method === "GET"
  ) {
    const filename = path.basename(
      pathname.replace("/COMP4537/labs/3/readFile/", "")
    );
    const filePath = path.join(__dirname, filename);

    // Security check: Prevent directory traversal attacks
    if (filename.includes("..")) {
      res.statusCode = 400; // Bad Request
      res.setHeader("Content-Type", "text/plain");
      res.end("Bad Request: Invalid filename.");
      return;
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist
        res.statusCode = 404; // Not Found
        res.setHeader("Content-Type", "text/plain");
        res.end(`404 Not Found: The file "${filename}" does not exist.`);
        return;
      }

      // Read and display the file content
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          res.statusCode = 500; // Internal Server Error
          res.setHeader("Content-Type", "text/plain");
          res.end("Internal Server Error: Could not read the file.");
          return;
        }

        res.statusCode = 200; // OK
        res.setHeader("Content-Type", "text/plain");
        res.end(data);
      });
    });
  }
  // Handle 404 Not Found for other routes
  else {
    res.statusCode = 404; // Not Found
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found");
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
