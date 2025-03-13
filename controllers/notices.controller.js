import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 });
import { extractAllNotices, extractNotices } from "../lib/scraper.js"
export const getAllNotices = async (req, res) => {
  const cachedNotices = cache.get('allNotices');
  if (cachedNotices) return res.json(cachedNotices);

  const notices = await extractAllNotices();
  if (!notices.length) return res.status(404).json({ message: 'Not found' });

  cache.set('allNotices', notices);
  res.json(notices);
};

export const getNoticesByPage = async (req, res) => {
  const page = req.query.page;
  const notices = await extractNotices(page);
  if (!notices.length) return res.status(404).json({ message: 'Not found' });

  res.json(notices);
};
