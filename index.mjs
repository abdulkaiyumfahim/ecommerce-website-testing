import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.goto("https://alameda-fluid-demo.squarespace.com/", {
  waitUntil: "networkidle0",
});
await page.waitForSelector(".product-lists-item");

const productLinks = await page.evaluate(() => {
  return [...document.querySelectorAll(".product-lists-item")].map(
    (e) => e.href
  );
});

console.log(productLinks);

await page.click();
await browser.close();
