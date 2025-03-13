import { load } from "cheerio";
import { json } from "express";
const getHTML = async (url) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Fetch Error:', error.message);
    return json({ error: error.message });
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
export { extractAllNotices, extractNotices };
