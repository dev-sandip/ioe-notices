import { load } from 'cheerio';
import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const baseUrl = "http://exam.ioe.edu.np";

const getHTML = async (url) => {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const extractNotices = async (page) => {
  const url = page ? `${baseUrl}?page=${page}` : baseUrl;
  const html = await getHTML(url);
  if (!html) {
    return [];
  }
  const $ = load(html);
  const notices = [];
  $('#datatable tbody tr').each((index, element) => {
    const notice = {
      sn: $(element).find('td').eq(0).text().trim(),
      title: $(element).find('td').eq(1).text().trim(),
      attachmentLink: $(element).find('td a').attr('href'),
      date: $(element).find('td').eq(2).text().trim()
    };
    notice.attachmentLink = notice.attachmentLink.replace(/ /g, '%20');
    const fullLink = baseUrl + notice.attachmentLink;
    notices.push({ ...notice, attachmentLink: fullLink });
  });
  return notices;
};

const extractAllNotices = async () => {
  let page = 1;
  let allNotices = [];
  while (true) {
    const notices = await extractNotices(page);
    if (notices.length === 0) {
      break;
    }
    allNotices = allNotices.concat(notices);
    page++;
  }
  return allNotices;
};

const app = express();
app.use(json());
const cache = new NodeCache({ stdTTL: 600 });

const windowMs = 5 * 60 * 1000;
const limiter = rateLimit({
  windowMs,
  max: 40,
  message: `Too many requests from this IP, please try again after ${windowMs / 60000} minutes`
});
app.use(limiter);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IOE Notices API',
      version: '1.0.0',
      description: 'API for scraping and fetching notices from IOE exam site',
      contact: {
        name: 'Sandip Sapkota',
        url: 'https://github.com/dev-sandip'
      }
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./index.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Notice:
 *       type: object
 *       properties:
 *         sn:
 *           type: string
 *         title:
 *           type: string
 *         attachmentLink:
 *           type: string
 *         date:
 *           type: string
 */

/**
 * @swagger
 * /allNotices:
 *   get:
 *     summary: Retrieve all notices
 *     description: Scrapes and returns all notices from the website. Cached for 10 minutes.
 *     responses:
 *       200:
 *         description: A list of notices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 *       404:
 *         description: No notices found
 */
app.get('/allNotices', async (req, res) => {
  const cachedNotices = cache.get('allNotices');
  if (cachedNotices) {
    return res.json(cachedNotices);
  }
  const notices = await extractAllNotices();
  if (notices.length === 0) {
    return res.status(404).json({ message: 'Not found' });
  }
  cache.set('allNotices', notices);
  res.json(notices);
});

/**
 * @swagger
 * /notices:
 *   get:
 *     summary: Retrieve notices from a specific page
 *     description: Fetch notices from a given page number.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number to fetch notices from
 *     responses:
 *       200:
 *         description: A list of notices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 *       404:
 *         description: No notices found
 */
app.get('/notices', async (req, res) => {
  const page = req.query.page;
  const notices = await extractNotices(page);
  if (notices.length === 0) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(notices);
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Home
 *     description: Provides information about the available endpoints.
 *     responses:
 *       200:
 *         description: API Home with available routes
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to IOE Notices API',
    endpoints: [
      { url: '/api-docs', description: 'Swagger Documentation' },
      { url: '/allNotices', description: 'Get all notices' },
      { url: '/notices?page=1', description: 'Get notices of a specific page' }
    ],
    author: 'Sandip Sapkota',
    github: 'https://github.com/dev-sandip'
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
