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
// await browser.close();

for (const productLink of productLinks) {
  const page = await browser.newPage();
  await page.goto(productLink, { waitUntil: "networkidle0" });

  await page.waitForSelector(".grid-title");
  const title = page.evaluate(() => {
    return document.querySelector(".grid-title")?.innerHTML;
  });

  const price = page.evaluate(() => {
    return document.querySelector(".product-price")?.innerHTML;
  });
  console.log(productLink, title, price);
  await page.close();
}
