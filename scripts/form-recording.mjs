#!/usr/bin/env node
/**
 * Visual recording of form completion: Form 1 and Form 2.
 * Takes screenshots before and after every interaction.
 */

import { firefox } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "form-recording-screenshots");

const URL = "http://localhost:3000/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms";

async function main() {
    const fs = await import("fs");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const screenshots = [];

    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.setDefaultTimeout(10000);

    try {
        await page.goto(URL, { waitUntil: "networkidle" });

        // --- FORM 1 ---
        // Step 1: Screenshot of initial state (BEFORE any interaction)
        const path1 = path.join(outputDir, "01-initial-state-before-interaction.png");
        await page.screenshot({ path: path1, fullPage: true });
        screenshots.push(["01", "Initial state - both forms before any interaction"]);

        // Step 2: Click the "Trigger type" dropdown in LEFT panel (Form 1)
        await page.locator("#trigger-type").first().click();

        // Step 3: Screenshot showing dropdown open (AFTER click)
        const path2 = path.join(outputDir, "02-form1-dropdown-open.png");
        await page.screenshot({ path: path2, fullPage: true });
        screenshots.push(["02", "Form 1 - Trigger type dropdown open with options visible"]);

        // Step 4: Click "Scheduled" option (use role=option for dropdown item, not the displayed value)
        await page.getByRole("option", { name: "Scheduled" }).click();

        // Step 5: Screenshot showing schedule configuration appeared (AFTER selection)
        const path3 = path.join(outputDir, "03-form1-schedule-configured.png");
        await page.screenshot({ path: path3, fullPage: true });
        screenshots.push(["03", "Form 1 - Schedule configuration visible (Simple tab, Every 1 Day)"]);

        // --- FORM 2 ---
        // Step 6: Screenshot of Form 2 (already configured - same view shows both)
        const path4 = path.join(outputDir, "04-form2-initial-state.png");
        await page.screenshot({ path: path4, fullPage: true });
        screenshots.push(["04", "Form 2 - Initial state (already configured: Scheduled, Run every 1 Day)"]);

        // --- FINAL ---
        // Step 7: Final screenshot - both completed forms side by side
        const path5 = path.join(outputDir, "05-final-both-forms-complete.png");
        await page.screenshot({ path: path5, fullPage: true });
        screenshots.push(["05", "Final - Both forms completed side by side"]);
    } finally {
        await browser.close();
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("SCREENSHOT RECORDING SUMMARY");
    console.log("=".repeat(60));
    for (const [num, desc] of screenshots) {
        console.log(`  ${num}. ${desc}`);
    }
    console.log("=".repeat(60));
    console.log(`\nScreenshots saved to: ${outputDir}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
