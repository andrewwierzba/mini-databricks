import { chromium, Locator, Page } from "playwright";
import path from "path";

const BASE_URL = "http://localhost:3000/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms?dual=true";
const OUTPUT_DIR = path.join(__dirname, "../recordings");

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Animate cursor smoothly to target position
async function animateCursor(
	page: Page,
	cursorNum: 1 | 2,
	startX: number,
	startY: number,
	endX: number,
	endY: number
) {
	// Calculate distance to determine duration (more human-like)
	const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
	const duration = Math.max(400, Math.min(800, distance * 1.5)); // 400-800ms based on distance
	const steps = Math.round(duration / 16); // ~60fps

	for (let i = 0; i <= steps; i++) {
		const progress = i / steps;
		// Ease-in-out curve for more natural movement
		const eased = progress < 0.5
			? 2 * progress * progress
			: 1 - Math.pow(-2 * progress + 2, 2) / 2;
		const x = startX + (endX - startX) * eased;
		const y = startY + (endY - startY) * eased;
		await page.evaluate(
			({ num, x, y }) => {
				const fn = (window as unknown as Record<string, (x: number, y: number) => void>)[`setCursor${num}`];
				if (fn) fn(x, y);
			},
			{ num: cursorNum, x, y }
		);
		await delay(16); // ~60fps
	}
}

// Get element center coordinates
async function getElementCenter(locator: Locator): Promise<{ x: number; y: number }> {
	const box = await locator.boundingBox();
	if (!box) throw new Error("Element not found");
	return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

interface CursorPos {
	x: number;
	y: number;
}

async function recordDualJourney() {
	console.log("Recording dual cursor journey (sequential)...");

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
	await delay(1500);

	// Initialize cursor positions
	let pos1: CursorPos = { x: 200, y: 200 };
	let pos2: CursorPos = { x: 900, y: 200 };

	// Show both cursors at starting positions
	await page.evaluate(() => {
		const w = window as unknown as Record<string, (x: number, y: number, v?: boolean) => void>;
		w.setCursor1(200, 200, true);
		w.setCursor2(900, 200, true);
	});
	await delay(1000);

	const form1 = page.locator(".p-6").first();
	const form2 = page.locator(".p-6").nth(1);

	// ========== AGENT 1: Complete Form 1 (Advanced schedule) ==========
	console.log("Agent 1 starting Form 1...");
	await page.evaluate(() => (window as unknown as Record<string, () => void>).startTimer1());

	// Step 1: Click trigger type dropdown
	const triggerDropdown = form1.locator('[id="trigger-type"]');
	let targetPos = await getElementCenter(triggerDropdown);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(300);
	await triggerDropdown.click();
	await delay(600);

	// Step 2: Select "Scheduled"
	const scheduledOption = page.getByRole("option", { name: "Scheduled" });
	targetPos = await getElementCenter(scheduledOption);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(250);
	await scheduledOption.click();
	await delay(700);

	// Step 3: Click "Advanced" tab
	const advancedTab = form1.getByRole("tab", { name: "Advanced" });
	targetPos = await getElementCenter(advancedTab);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(300);
	await advancedTab.click();
	await delay(600);

	// Step 4: Click hour dropdown and select 23
	const hourDropdown = form1.locator("button[role='combobox']").filter({ hasText: /^9$|^09$/ }).first();
	targetPos = await getElementCenter(hourDropdown);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(300);
	await hourDropdown.click();
	await delay(500);

	// Scroll to find 23
	const hourViewport = page.locator("[data-radix-select-viewport]").first();
	const hvPos = await getElementCenter(hourViewport);
	await animateCursor(page, 1, pos1.x, pos1.y, hvPos.x, hvPos.y);
	pos1 = hvPos;
	for (let i = 0; i < 4; i++) {
		await page.mouse.move(hvPos.x, hvPos.y);
		await page.mouse.wheel(0, 150);
		await delay(150);
	}
	await delay(300);

	const hour23 = page.getByRole("option", { name: "23" });
	targetPos = await getElementCenter(hour23);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(250);
	await hour23.click();
	await delay(600);

	// Step 5: Click minute dropdown and select 45
	const minuteDropdown = form1.locator("button[role='combobox']").filter({ hasText: /^0$|^00$/ }).first();
	targetPos = await getElementCenter(minuteDropdown);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(300);
	await minuteDropdown.click();
	await delay(500);

	// Scroll to find 45
	const minViewport = page.locator("[data-radix-select-viewport]").first();
	const mvPos = await getElementCenter(minViewport);
	await animateCursor(page, 1, pos1.x, pos1.y, mvPos.x, mvPos.y);
	pos1 = mvPos;
	for (let i = 0; i < 6; i++) {
		await page.mouse.move(mvPos.x, mvPos.y);
		await page.mouse.wheel(0, 120);
		await delay(120);
	}
	await delay(300);

	const minute45 = page.getByRole("option", { name: "45" });
	targetPos = await getElementCenter(minute45);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(250);
	await minute45.click();
	await delay(600);

	// Step 6: Select timezone - New York
	const tzDropdown = form1.locator("button[role='combobox']").filter({ hasText: /Amsterdam|UTC/ });
	targetPos = await getElementCenter(tzDropdown);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(300);
	await tzDropdown.click();
	await delay(500);

	const nyOption = page.getByRole("option", { name: "(UTC-05:00) New York" });
	targetPos = await getElementCenter(nyOption);
	await animateCursor(page, 1, pos1.x, pos1.y, targetPos.x, targetPos.y);
	pos1 = targetPos;
	await delay(250);
	await nyOption.click();
	await page.evaluate(() => (window as unknown as Record<string, () => void>).stopTimer1());
	console.log("✓ Agent 1 - Form 1 COMPLETE!");
	await delay(800);

	// ========== AGENT 2: Complete Form 2 (Simple time + timezone) ==========
	console.log("Agent 2 starting Form 2...");
	await page.evaluate(() => (window as unknown as Record<string, () => void>).startTimer2());

	// Step 1: Click time input and set time to 23:45
	const timeInput = form2.locator('input[type="time"]');
	targetPos = await getElementCenter(timeInput);
	await animateCursor(page, 2, pos2.x, pos2.y, targetPos.x, targetPos.y);
	pos2 = targetPos;
	await delay(300);
	await timeInput.click();
	await delay(300);
	// Fill the time input with the correct value
	await timeInput.fill("23:45");
	await delay(600);

	// Step 2: Click timezone button (search input auto-focuses)
	const timezoneButton = form2.getByRole("button", { name: /Time zone/i });
	targetPos = await getElementCenter(timezoneButton);
	await animateCursor(page, 2, pos2.x, pos2.y, targetPos.x, targetPos.y);
	pos2 = targetPos;
	await delay(300);
	await timezoneButton.click();
	await delay(500);

	// Step 3: Type search (input is already focused)
	await page.keyboard.type("New York", { delay: 80 });
	await delay(600);

	// Step 4: Click New York option
	const newYorkButton = page.getByRole("option", { name: "(UTC-05:00) New York" });
	targetPos = await getElementCenter(newYorkButton);
	await animateCursor(page, 2, pos2.x, pos2.y, targetPos.x, targetPos.y);
	pos2 = targetPos;
	await delay(300);
	await newYorkButton.click();
	await page.evaluate(() => (window as unknown as Record<string, () => void>).stopTimer2());
	console.log("✓ Agent 2 - Form 2 COMPLETE!");
	await delay(2000);

	console.log("Recording complete!");

	await context.close();
	await browser.close();

	const video = page.video();
	if (video) {
		const videoPath = await video.path();
		console.log(`Video saved to: ${videoPath}`);
	}
}

async function main() {
	const fs = await import("fs");
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	console.log(`Video will be saved to: ${OUTPUT_DIR}\n`);
	await recordDualJourney();
	console.log("\n✅ Recording complete!");
}

main().catch(console.error);
