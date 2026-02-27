#!/usr/bin/env node
/**
 * Visual recording of form completion: Form 1 and Form 2.
 * Takes screenshots before and after every interaction.
 * Uses ?id=agent to show cursor label and page.mouse.move() to position it.
 */

import { firefox } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "form-recording-screenshots");

const BASE_URL = "http://localhost:3000/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms";

let stepCounter = 0;

async function moveTo(page, locator) {
	const box = await locator.boundingBox();
	if (box) {
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.waitForTimeout(100);
	}
}

async function scrollThroughDropdown(page, targetOption, { screenshots, steps = 4 } = {}) {
	const dropdown = page.locator("[data-radix-select-viewport]");
	const dropdownBox = await dropdown.boundingBox();
	if (!dropdownBox) return;

	const x = dropdownBox.x + dropdownBox.width / 2;

	for (let i = 1; i <= steps; i++) {
		const y = dropdownBox.y + (dropdownBox.height * i) / (steps + 1);
		await page.mouse.move(x, y);
		await page.waitForTimeout(120);
	}

	const targetBox = await targetOption.boundingBox();
	if (!targetBox) {
		await page.evaluate((el) => el.scrollIntoView({ block: "center" }), await targetOption.elementHandle());
		await page.waitForTimeout(100);
	}

	await moveTo(page, targetOption);

	if (screenshots) {
		stepCounter++;
		const num = String(stepCounter).padStart(2, "0");
		const p = path.join(outputDir, `${num}-scroll-to-option.png`);
		await page.screenshot({ path: p, fullPage: true });
		screenshots.push([num, "Cursor scrolled to target option"]);
	}
}

async function capture(page, screenshots, description) {
	stepCounter++;
	const num = String(stepCounter).padStart(2, "0");
	const p = path.join(outputDir, `${num}-${description.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`);
	await page.screenshot({ path: p, fullPage: true });
	screenshots.push([num, description]);
}

async function main() {
	const fs = await import("fs");
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const screenshots = [];
	const cursorId = "agent";

	const browser = await firefox.launch({ headless: true });
	const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
	page.setDefaultTimeout(10000);

	try {
		await page.goto(`${BASE_URL}?id=${cursorId}`, { waitUntil: "networkidle" });

		// --- FORM 1 ---
		const triggerTypeDropdown = page.locator("#trigger-type").first();

		await moveTo(page, triggerTypeDropdown);
		await capture(page, screenshots, "Initial state - cursor on trigger type dropdown");

		await triggerTypeDropdown.click();
		const scheduledOption = page.getByRole("option", { name: "Scheduled" });
		await scrollThroughDropdown(page, scheduledOption, { screenshots });
		await capture(page, screenshots, "Form 1 - Dropdown open, cursor on Scheduled");

		await scheduledOption.click();
		await page.waitForTimeout(200);
		await page.mouse.move(300, 300);
		await capture(page, screenshots, "Form 1 - Schedule configured (Simple tab, Every 1 Day)");

		// --- FORM 2 ---
		const form2Type = page.locator("#trigger-type").nth(1);
		await moveTo(page, form2Type);
		await capture(page, screenshots, "Form 2 - Already configured (Scheduled, Run every 1 Day)");

		// --- FINAL ---
		await page.mouse.move(960, 540);
		await page.waitForTimeout(100);
		await capture(page, screenshots, "Final - Both forms completed");
	} finally {
		await browser.close();
	}

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
