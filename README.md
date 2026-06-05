# Exam #N: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/sessions`
  - request parameters: none
  - request body content: JSON object with `username` and `password`
  - response body content: JSON object containing the authenticated `user` info (e.g., `{ id, username }`)
- GET `/api/sessions/current`
  - request parameters: none (uses session cookie)
  - response body content: JSON object of the currently authenticated `user`
- DELETE `/api/sessions/current`
  - request parameters: none
  - response body content: empty body (terminates the session)
- GET `/api/network`
  - request parameters: none (requires authentication)
  - response body content: JSON array containing the list of all lines, stations, and their connections ordered by line and stop order.
- GET `/api/events`
  - request parameters: none (requires authentication)
  - response body content: JSON array of all possible random events, each with their `event_id`, `event_name`, `bonus`, and `weight`.
- GET `/api/games`
  - request parameters: none (requires authentication)
  - response body content: JSON array representing the leaderboard, containing the best `score` achieved by each `username`.
- POST `/api/games/setup`
  - request parameters: none (requires authentication)
  - request body content: none
  - response body content: JSON object containing a randomly generated valid route assignment, including `start` station, `end` station, and the `minDistance` (which is guaranteed to be >= 3).
- POST `/api/games/validate`
  - request parameters: none (requires authentication)
  - request body content: JSON object with `startId`, `endId`, and an array of `segments`, e.g., `{ "startId": 14, "endId": 7, "segments": [ { "startId": 14, "endId": 6 }, { "startId": 6, "endId": 7 } ] }`
  - response body content: JSON object containing the game result. If invalid, `{ "isValid": false, "error": "...", "finalScore": 0 }`. If valid, returns `{ "isValid": true, "events": [{ "step": 1, "segment": "Green Park -> Oxford Circus", "message": "Mind the gap!", "scoreChange": -1 }], "finalScore": 19 }`


## Database Tables

- Table `users` - contains users, with their ids, passwords.
- Table `games` - contains games played by users.
- Table `stations` - contains station names and their ids, to be better identified in the segment construction.
- Table `lines` - contains lines that are derived from lists of station ids
- Table `station_line` - contains correspondence between stations and lines, with their stop order to provide better segment checks
- Table `events` - contains events that are randomically picked to add/subtract user coins

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
