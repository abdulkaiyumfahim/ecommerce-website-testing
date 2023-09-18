// import puppeteer from "puppeteer";

// const browser = await puppeteer.launch({ headless: false });
// const page = await browser.newPage();

// await page.goto("https://alameda-fluid-demo.squarespace.com/", {
//   waitUntil: "networkidle0",
// });
// await page.waitForSelector(".product-lists-item");

// const productLinks = await page.evaluate(() => {
//   return [...document.querySelectorAll(".product-lists-item")].map(
//     (e) => e.href
//   );
// });

// console.log(productLinks);

// await page.close();
// // await browser.close();

// for (const productLink of productLinks) {
//   const page = await browser.newPage();
//   await page.goto(productLink, { waitUntil: "networkidle0" });

//   await page.waitForSelector(".grid-title");
//   const title = page.evaluate(() => {
//     return document.querySelector(".grid-title")?.innerHTML;
//   });

//   const price = page.evaluate(() => {
//     return document.querySelector(".product-price")?.innerHTML;
//   });
//   console.log(productLink, title, price);
//   await page.close();
// }

import puppeteer, { Page } from "puppeteer";
import { setTimeout } from "timers/promises";

(async () => {
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

  await page.close();

  const extractText = (page, selector) => {
    return page.evaluate((selector) => {
      return document.querySelector(selector)?.innerHTML;
    }, selector);
  };

  for (const productLink of productLinks) {
    const page = await browser.newPage();
    await page.goto(productLink, { waitUntil: "networkidle0" });

    await page.waitForSelector(".grid-title");

    const title = await extractText(page, ".grid-title");
    const price = await extractText(page, ".product-price");

    const variantOptions = await page.evaluate(() => {
      const options = document.querySelectorAll(
        '[aria-label="Select Size"] option'
      );
      return Array.from(options).map((option) => option.value);
    });

    const variantData = [];

    for (const variant of variantOptions) {
      await page.select('[aria-label="Select Size"]', variant);
      await page.waitForTimeout(1000); // Use page.waitForTimeout to pause execution
      variantData.push({
        variant,
        price: await extractText(page, ".product-price"),
      });
    }

    console.log({ productLink, title, price, variantData });
    await page.close();
  }

  await browser.close(); // Close the browser when done.
})();
