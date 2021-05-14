import express from 'express';
import cors from 'cors';
import { wordExists } from "./scripts/word-lookup";

const app = express();
const port = 3000;

/** 
 * Cross-origin resource sharing (CORS)
 * 
 * A HTTP-header based mechanism that allows a server to indicate
 * any other origins (domain, scheme or port) than its own
 * from which a browser should permit loading of resources.
 * 
 * src: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
app.use(cors());

/**
 * Body parser middleware
 * 
 * Parses incoming request bodies in a middleware before any handlers.
 * Available under the [request].body property
 * 
 * NOTICE:
 * - [request].body is based on user-controlled input,
 *   all property and values in this object are untrusted
 *   and should be validated before trusting.
 * - Does not handle multipart bodies
 * 
 * src: http://expressjs.com/en/resources/middleware/body-parser.html
 */
app.use(express.json())

// GET Endpoint example
app.get('/', (req, res) => {
  res.json({
    data: 'value'
  })
});

// POST Endpoint example
app.post('/', (req, res) => {
  res.json({
    data: req.body
  })
});

app.get('/wordchecker/:language/:word', (req, res) => {
  wordExists(req.params.word, req.params.language, (foundWord: boolean) => {
    res.json({
      exists: foundWord
    });
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});