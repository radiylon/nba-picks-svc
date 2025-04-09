# NBA Initial Assessment

## Goals
- Please complete to the best of your ability
- Required: TypeScript with tests
- JavaScript should be able to run on Codepen or StackBlitz
- Submit source files as .zip

## Problem Statement
We deal with a lot of player and game statistics every day. Today there is a business need for us to look into how many first round and second round players there are for a given team. This data is important as it shows how the team has been performing with their player picks in the NBA draft. So, we are looking for a consolidated data to see how many players are from round 1 and round 2.

You can use https://www.balldontlie.io/#getting-started to find the documentation on the API you will need to use to successfully produce the results. You can sign up for the API Key with free tier. You should be able to run everything with the free version.

Please consider the following APIs to succeed in this assessment:

- `GET https://www.balldontlie.io/api/v1/players`
- `GET https://www.balldontlie.io/api/v1/teams`

The output needs to be similar to this:

```text
Team Name: Golden State Warriors
Draft Rounds: {"1": 13, "2": 7, "null": 5}
```

## Assumptions
Due to the nature of the "BallDontLie" API, I am making a few assumptions:
- We are only interested in the first 25 players returned
- We have no way of filtering out inactive players, so they are included in the data
- We have no way of filtering out players who were previously on the team, so they are included in the data

## Installation
1. Clone the repository
2. Create a `.env` file and add your BallDontLie API key as `BALL_DONT_LIE_API_KEY=your_api_key`
3. Change your node version to `v18.20.3`
4. Install dependencies with `npm install`
5. Run the app locally with `npm run dev`
6. Run test suites with `npm run test` or individually:
    - Unit tests `npm run test:unit`
    - Contract tests `npm run test:contract`

## Example Usage
After successfully installing the application, you should now be able to navigate to `http://localhost:3000/v1/draft-pick-counts/:teamId` with parameter `teamId` and see results.

Example:
```text
http://localhost:3000/v1/draft-pick-counts/1
```

Result:
```json
{
  "Team Name": "Atlanta Hawks",
  "Draft Rounds": {
    "1": 11,
    "2": 8,
    "null": 5
  }
}
```
