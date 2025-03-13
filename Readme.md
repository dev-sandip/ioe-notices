# IOE Notices API

## Overview

This API scrapes and provides notices from the IOE exam website. It uses Express.js, Cheerio for web scraping, and Swagger for API documentation.

## Features

- Fetch notices from the IOE exam website.
- Retrieve all available notices or notices from a specific page.
- Rate-limiting to prevent abuse.
- Caching to improve performance.
- Swagger documentation for easy API exploration.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/dev-sandip/ioe-notices.git
   cd ioe-notices
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

### Start the Server

```sh
npm start
```

The server will run at `http://localhost:3000`.

### API Endpoints

#### 1. Home Route

- **URL:** `/`
- **Method:** `GET`
- **Description:** Provides API information.

#### 2. Get All Notices

- **URL:** `/allNotices`
- **Method:** `GET`
- **Description:** Scrapes and returns all available notices. Data is cached for 10 minutes.
- **Rate limit:** Max 40 requests per 5 minutes.

#### 3. Get Notices by Page

- **URL:** `/notices?page=1`
- **Method:** `GET`
- **Description:** Fetches notices from a specific page.

### Swagger Documentation

Swagger UI is available at:

```sh
http://localhost:3000/api-docs
```

## Dependencies

- **Express.js** - Web framework for Node.js.
- **Cheerio** - Fast, flexible, and lean implementation of jQuery for Node.js.
- **Node-cache** - Caching mechanism.
- **Express-rate-limit** - Rate limiting middleware.
- **Swagger UI & Swagger JSDoc** - API documentation.

## Author

**Sandip Sapkota**  
GitHub: [dev-sandip](https://github.com/dev-sandip)
