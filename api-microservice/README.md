# freeCodeCamp APIs and Microservices Projects

## Timestamp Microservice
### API description
1. API endpoint is `GET [project_url]/api/timestamp/:date_string?`.
2. A date string is valid if can be successfully parsed by JS `new Date(date_string)`.
3. If the date string is **empty** the service uses the current timestamp.
4. If the date string is **valid** the api returns a JSON having the structure `{"unix": <date.getTime()>, "utc" : <date.toUTCString()> }`
5. If the date string is **invalid** the api returns a JSON having the structure `{"error":"Invalid Date"}`.

### Sample input-output
- input: `https://fcc-apis-uservices.glitch.me/api/timestamp/`, output: `{"unix":1587220975357,"utc":"Sat, 18 Apr 2020 14:42:55 GMT"}`
- input: `https://fcc-apis-uservices.glitch.me/api/timestamp/2015-12-15` and `https://fcc-apis-uservices.glitch.me/api/timestamp/1450137600000`, both outputs: `{"unix":1450137600000,"utc":"Tue, 15 Dec 2015 00:00:00 GMT"}`

## Request Header Parser
### API description
Using the API, I can get the IP address, preferred languages and system infos for my device.

### Sample input-output
input: `https://fcc-apis-uservices.glitch.me/api/whoami`, output: `{"ipaddress":"127.0.0.1","language":"en-US,en;q=0.9,id;q=0.8,ms;q=0.7,ja;q=0.6","software":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}`

## URL Shortener Microservice
### API description
1. I can POST a URL to `https://fcc-apis-uservices.glitch.me/api/shorturl/new` and receive a shortened URL in the JSON response.
2. If I pass an **invalid** URL, the JSON response will contain an error like `{"error":"invalid URL"}`.
3. When I visit the shortened URL, it will redirect me to my original link.

### Sample usage
1. Get shorten URL: `POST https://fcc-apis-uservices.glitch.me/api/shorturl/new - https://www.google.com`.
2. The shortened URL will redirect to the original link, in this case `https://www.google.com`.

## Exercise Tracker
### API description
1. I can create a user by posting form data username to `/api/exercise/new-user` and returned will be an object with `username` and `_id`.
2. I can get an array of all users by getting `/api/exercise/users` with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(`_id`), description, duration, and optionally date to `/api/exercise/add`. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting `/api/exercise/log` with a parameter of userId(`_id`). Returned will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

## File Metadata Microservice
### API description
I can submit a form that includes a file upload and receive the file name and size in bytes within the JSON response.
