import express from 'express';
import cors from 'cors';
import { wordExists } from "./scripts/word-lookup";
import { Tedis } from "redis-typescript";
import { readFileSync } from "fs";

const app = express();
const port = 3000;

let DATABASE_CONNECTED = false;
const tedis = new Tedis({
  port: 6379,
  host: "127.0.0.1",
  password: readFileSync("./.redis_password", "utf-8")
});

tedis.on("connect", () => {
  DATABASE_CONNECTED = true;
});

tedis.on("close", () => {
  DATABASE_CONNECTED = false;
});

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

app.post('/highscores/:uuid/:name/:score/:avatar/:layout', (req, res) => {
  try {
    tedis.hmset("highscore", {
      uuid: req.params.uuid,
      name: req.params.name,
      score: req.params.score,
      avatar: req.params.avatar,
      layout: req.params.layout
    });
    res.json({
      succes: true
    });
  } catch(e) {
    res.json({
      succes: false,
      reason: e
    })
  }
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});