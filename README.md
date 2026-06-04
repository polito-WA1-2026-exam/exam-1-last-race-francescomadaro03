# Exam #N: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/network`
  - request parameters: session id for authentication
  - response: list of lines and stations, ordered by their position in the line
- GET `/api/scores`
  - request parameters: session id
  - response body content: all best scores from users in the database
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

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
