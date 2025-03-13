//this file is just for testing purpose

import { load } from "cheerio";
import express, { json } from 'express';
const getHTML = async (url) => {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};


const extractNotices = async (page) => {
  const baseUrl = "http://exam.ioe.edu.np";
  const url = page ? `${baseUrl}?page=${page}` : baseUrl;
  const html = await getHTML(url);
  if (!html) {
    return [];
  }
  const $ = load(html);
  const notices = [];
  $("#datatable tbody tr").each((index, element) => {
    const notice = {
      sn: $(element).find("td").eq(0).text().trim(),
      title: $(element).find("td").eq(1).text().trim(),
      attachmentLink: $(element).find("td a").attr("href"),
      date: $(element).find("td").eq(2).text().trim(),
    };
    notice.attachmentLink = notice.attachmentLink.replace(/ /g, "%20");
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

app.get('/notice', async (req, res) => {
  const page = req.query.page;
  const notices = page ? await extractNotices(page) : null;
  if (!notices) {
    return res.status(404).json({ message: "Page not found" });
  }
  res.json(notices);
}
);
app.get("/allNotice", async (req, res) => {
  const notices = await extractAllNotices();
  if (notices.length === 0) {
    return res.status(404).json({ message: "No notices found" });
  }
  res.json(notices);


})
app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);