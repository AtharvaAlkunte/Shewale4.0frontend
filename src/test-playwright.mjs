import { chromium } from 'playwright';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`CONSOLE ERROR: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      // ignore warnings
    } else {
      errors.push(`CONSOLE LOG: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });

  try {
    console.log("Navigating to http://localhost:5173 ...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Switch language to Hindi
    console.log("Clicking language dropdown...");
    // Need to find the select or dropdown. Usually it's a select element
    const langSelect = await page.$('select');
    if (langSelect) {
      await langSelect.selectOption('hi');
      console.log("Selected Hindi");
    } else {
      // Maybe it's a separate button? We can just set localStorage if we know the key
      console.log("Select not found, setting localStorage i18nextLng");
      await page.evaluate(() => {
        localStorage.setItem('i18nextLng', 'hi');
      });
      await page.reload({ waitUntil: 'networkidle' });
      console.log("Reloaded with Hindi");
    }

    // Give it a moment to re-render
    await page.waitForTimeout(2000);
    
    // Check if #services exists
    const isVisible = await page.evaluate(() => {
      const section = document.getElementById('services');
      return section ? getComputedStyle(section).display !== 'none' && section.offsetHeight > 0 : false;
    });

    console.log(`TreatmentsSection visible: ${isVisible}`);

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    console.log("\nCaptured Errors:");
    errors.forEach(e => console.log(e));
    await browser.close();
  }
})();
