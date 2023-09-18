import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();

await page.goto("https://alameda-fluid-demo.squarespace.com/", {
  waitUntil: "networkidle2",
});
await page.waitForSelector(".grid-item-link product-lists-item");
const productLinks = await page.evaluate(() => {
  return [
    ...document.querySelectorAll(".grid-item-link product-lists-item"),
  ].map((e) => e.href);
});

console.log(productLinks);
await page.close();
await browser.close();
