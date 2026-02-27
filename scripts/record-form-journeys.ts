import { chromium, Locator, Page } from "playwright";
import path from "path";

const BASE_URL = "http://localhost:3000/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms?id=Agent";
const OUTPUT_DIR = path.join(__dirname, "../recordings");

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Animate mouse movement to an element with human-like motion
async function animateMouseTo(page: Page, locator: Locator, options?: { offsetX?: number; offsetY?: number }) {
	const box = await locator.boundingBox();
	if (!box) return;

	const targetX = box.x + box.width / 2 + (options?.offsetX ?? 0);
	const targetY = box.y + box.height / 2 + (options?.offsetY ?? 0);

	// Move mouse with steps to create smooth animation
	await page.mouse.move(targetX, targetY, { steps: 25 });
	await delay(100);
}

// Click with animated mouse movement
async function animateClick(page: Page, locator: Locator) {
	await animateMouseTo(page, locator);
	await delay(200);
	await locator.click();
}

// Scroll within a dropdown to find and click an option
async function scrollToOptionAndClick(page: Page, optionText: string, container?: Locator) {
	const option = page.getByRole("option", { name: optionText });

	// Check if option is visible, if not scroll to it
	const optionBox = await option.boundingBox();
	if (optionBox) {
		// Animate mouse to option
		await animateMouseTo(page, option);
		await delay(150);
		await option.click();
	} else {
		// Need to scroll - use keyboard
		await page.keyboard.press("End"); // Jump to end first for high values
		await delay(200);
		await option.scrollIntoViewIfNeeded();
		await delay(200);
		await animateMouseTo(page, option);
		await delay(150);
		await option.click();
	}
}

async function recordForm1Journey() {
	console.log("Recording Form 1 journey...");

	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext({
		recordVideo: {
			dir: OUTPUT_DIR,
			size: { width: 1280, height: 720 },
		},
		viewport: { width: 1280, height: 720 },
	});

	const page = await context.newPage();
	await page.goto(BASE_URL);
	await delay(1000);

	// Start mouse in center-left area
	await page.mouse.move(300, 360);
	await delay(500);

	const form1 = page.locator(".p-6").first();

	// Step 1: Click trigger type dropdown
	console.log("Step 1: Clicking trigger type dropdown...");
	const triggerTypeDropdown = form1.locator('[id="trigger-type"]');
	await animateClick(page, triggerTypeDropdown);
	await delay(600);

	// Step 2: Select "Scheduled"
	console.log("Step 2: Selecting Scheduled...");
	const scheduledOption = page.getByRole("option", { name: "Scheduled" }).first();
	await animateMouseTo(page, scheduledOption);
	await delay(200);
	await scheduledOption.click();
	await delay(800);

	// Step 3: Click Advanced tab
	console.log("Step 3: Clicking Advanced tab...");
	const advancedTab = form1.getByRole("tab", { name: "Advanced" });
	await animateClick(page, advancedTab);
	await delay(800);

	// Step 4: Click hour dropdown and scroll to 23
	console.log("Step 4: Setting hour to 23...");
	const hourDropdown = form1.locator("button[role='combobox']").filter({ hasText: /^9$|^09$/ }).first();
	await animateClick(page, hourDropdown);
	await delay(400);

	// Scroll down through the dropdown to show scrolling behavior
	const dropdownContent = page.locator("[data-radix-select-viewport]").first();
	await animateMouseTo(page, dropdownContent);
	await delay(200);

	// Scroll with mouse wheel
	for (let i = 0; i < 4; i++) {
		await page.mouse.wheel(0, 150);
		await delay(150);
	}
	await delay(300);

	const hour23 = page.getByRole("option", { name: "23" });
	await animateMouseTo(page, hour23);
	await delay(200);
	await hour23.click();
	await delay(600);

	// Step 5: Click minute dropdown and scroll to 45
	console.log("Step 5: Setting minute to 45...");
	const minuteDropdown = form1.locator("button[role='combobox']").filter({ hasText: /^0$|^00$/ }).first();
	await animateClick(page, minuteDropdown);
	await delay(400);

	// Scroll down to find 45
	const minuteDropdownContent = page.locator("[data-radix-select-viewport]").first();
	await animateMouseTo(page, minuteDropdownContent);
	await delay(200);

	for (let i = 0; i < 6; i++) {
		await page.mouse.wheel(0, 120);
		await delay(120);
	}
	await delay(300);

	const minute45 = page.getByRole("option", { name: "45" });
	await animateMouseTo(page, minute45);
	await delay(200);
	await minute45.click();
	await delay(600);

	// Step 6: Click timezone dropdown and select New York
	console.log("Step 6: Setting timezone to New York...");
	const timezoneDropdown = form1.locator("button[role='combobox']").filter({ hasText: /Amsterdam|UTC/ });
	await animateClick(page, timezoneDropdown);
	await delay(400);

	const newYorkOption = page.getByRole("option", { name: "(UTC-05:00) New York" });
	await animateMouseTo(page, newYorkOption);
	await delay(200);
	await newYorkOption.click();
	await delay(1200);

	console.log("Form 1 journey complete!");

	await context.close();
	await browser.close();

	const video = page.video();
	if (video) {
		const videoPath = await video.path();
		console.log(`Form 1 video saved to: ${videoPath}`);
	}
}

async function recordForm2Journey() {
	console.log("\nRecording Form 2 journey...");

	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext({
		recordVideo: {
			dir: OUTPUT_DIR,
			size: { width: 1280, height: 720 },
		},
		viewport: { width: 1280, height: 720 },
	});

	const page = await context.newPage();
	await page.goto(BASE_URL);
	await delay(1000);

	// Start mouse in center-right area
	await page.mouse.move(900, 360);
	await delay(500);

	const form2 = page.locator(".p-6").nth(1);

	// Step 1: Set time to 23:45
	console.log("Step 1: Setting time to 23:45...");
	const timeInput = form2.locator('input[type="time"]');
	await animateClick(page, timeInput);
	await delay(300);

	// Type time with slight delays to look natural
	await page.keyboard.press("ArrowUp"); // Clear/select
	await delay(100);
	for (const char of "2345") {
		await page.keyboard.type(char, { delay: 80 });
	}
	await delay(800);

	// Step 2: Click timezone button
	console.log("Step 2: Opening timezone selector...");
	const timezoneButton = form2.getByRole("button", { name: /Time zone/i });
	await animateClick(page, timezoneButton);
	await delay(600);

	// Step 3: Type "New York" in search with natural typing
	console.log("Step 3: Searching for New York...");
	const searchInput = page.getByPlaceholder("Search time zones");
	await animateMouseTo(page, searchInput);
	await delay(200);
	await searchInput.click();
	await delay(200);

	for (const char of "New York") {
		await page.keyboard.type(char, { delay: 60 });
	}
	await delay(600);

	// Step 4: Click New York option
	console.log("Step 4: Selecting New York timezone...");
	const newYorkButton = page.getByRole("button", { name: "(UTC-05:00) New York" });
	await animateMouseTo(page, newYorkButton);
	await delay(200);
	await newYorkButton.click();
	await delay(1200);

	console.log("Form 2 journey complete!");

	await context.close();
	await browser.close();

	const video = page.video();
	if (video) {
		const videoPath = await video.path();
		console.log(`Form 2 video saved to: ${videoPath}`);
	}
}

async function main() {
	const fs = await import("fs");
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	console.log(`Videos will be saved to: ${OUTPUT_DIR}\n`);

	await recordForm1Journey();
	await delay(2000);
	await recordForm2Journey();

	console.log("\n✅ All recordings complete!");
	console.log(`Check the recordings folder: ${OUTPUT_DIR}`);
}

main().catch(console.error);
