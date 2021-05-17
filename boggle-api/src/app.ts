import express from 'express';
import cors from 'cors';
import { wordExists } from "./scripts/word-lookup";
// import { Tedis } from "redis-typescript";
import { readFileSync } from "fs";
import redis from "redis";

const app = express();
const port = 3000;
const redis_port = 6379;
const api_key = readFileSync("./.api_key", "utf-8");

app.use(cors());

const redis_client = redis.createClient(redis_port);
redis_client.auth(readFileSync("./.redis_password", "utf-8"));

let DATABASE_CONNECTED = false;
/*const tedis = new Tedis({
  port: 6379,
  host: "127.0.0.1",
  password: readFileSync("./.redis_password", "utf-8")
});*/

redis_client.on("connect", () => {
  DATABASE_CONNECTED = true;
});

redis_client.on("close", () => {
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
  });
});

// POST Endpoint example
app.post('/', (req, res) => {
  res.json({
    data: req.body
  });
});

app.get('/wordchecker/:language/:word', (req, res) => {
  wordExists(req.params.word, req.params.language, (foundWord: boolean) => {
    res.json({
      exists: foundWord
    });
  });
});

app.get('/highscores', (req, res) => {
  if (!DATABASE_CONNECTED) {
    res.json({
      succes: false,
      reason: "Database is not connected"
    });
    return;
  }
  const start = req.query["start"];
  const end = req.query["end"];

  let offset;
  let count;

  if (start && end) {
    if (isNaN(Number(start)) || isNaN(Number(end))) {
      res.json({
        success: false,
        reason: "start or end were not valid numbers"
      });
      return;
    }
    offset = Number(start);
    count = Number(end) - Number(start) + 1;
    if (count < 0) {
      res.json({
        success: false,
        reason: "Invalid start and end position, end should be bigger or the same as start"
      });
      return;
    }
  }

  // SORT highscore_indices BY *->score asc GET *->name GET *->score GET *->avatar GET *->layout LIMIT offset count
  redis_client.sort(
    "highscore_indices",
    `BY *->score desc GET *->name GET *->score GET *->avatar GET *->layout LIMIT ${offset} ${count}`.split(' '),
    (err, values) => {
      if (err) {
        res.json({
          success: false,
          reason: "Error while retrieving requested data"
        });
        return;
      }
      let return_object: Object[] = [];
      let i = 0;
      while (i < values.length) {
        return_object.push({
          name: values[i++],
          score: values[i++],
          avatar: values[i++],
          layout: values[i++]
        });
      }
      res.json({
        success: true,
        values: return_object
      });
    }
  );
});

app.post('/highscores/:uuid/:name/:score/:avatar/:layout', (req, res) => {
  // TODO: Add authentication
  if (!DATABASE_CONNECTED) {
    return res.json({
      succes: false,
      reason: "Database is not connected"
    });
  }
  if (!req.headers.authorization) {
    return res.status(403).json({
      success: false,
      reason: "No credentials set"
    });
  }
  if (req.headers.authorization !== api_key) {
    return res.status(403).json({
      success: false,
      reason: "Invalid credentials"
    });
  }
  try {
    const highscore_key = `highscore:${req.params.uuid}`;
    const name: string = req.params.name;
    if (isNaN(Number(req.params.score))) {
      return res.json({
        success: false,
        reason: "Score was not a valid number"
      });
    }
    const score: number = Number(req.params.score);
    const avatar: string = req.params.avatar;
    const layout: number[] = JSON.parse(req.params.layout);
    redis_client.hset(highscore_key,
      "name", name,
      "score", score.toString(),
      "avatar", avatar,
      "layout", JSON.stringify(layout)
    );

    // Set indice (used for sorting)
    redis_client.sadd('highscore_indices', highscore_key);
    return res.json({
      succes: true
    });
  } catch (e) {
    console.log(e);
    return res.json({
      succes: false,
      reason: "Error while retrieving requested data"
    });
  }
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});