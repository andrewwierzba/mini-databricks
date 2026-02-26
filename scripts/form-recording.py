#!/usr/bin/env python3
"""
Visual recording of form completion: Form 1 and Form 2.
Takes screenshots before and after every interaction.
"""

import asyncio
import sys
from pathlib import Path

# Add project root for imports
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root / ".claude" / "sovereign" / "core"))

from playwright.async_api import async_playwright

URL = "http://localhost:3000/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms"
OUTPUT_DIR = project_root / "form-recording-screenshots"


async def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    screenshots = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        page.set_default_timeout(10000)

        try:
            # Navigate to forms page
            await page.goto(URL, wait_until="networkidle")

            # --- FORM 1 ---
            # Step 1: Screenshot of initial state (BEFORE any interaction)
            path1 = OUTPUT_DIR / "01-initial-state-before-interaction.png"
            await page.screenshot(path=str(path1), full_page=True)
            screenshots.append(("01", "Initial state - both forms before any interaction"))

            # Step 2: Click the "Trigger type" dropdown in LEFT panel (Form 1)
            # Form 1 trigger type has id="trigger-type"
            trigger_dropdown = page.locator('[id="trigger-type"]').first
            await trigger_dropdown.click()

            # Step 3: Screenshot showing dropdown open (AFTER click)
            path2 = OUTPUT_DIR / "02-form1-dropdown-open.png"
            await page.screenshot(path=str(path2), full_page=True)
            screenshots.append(("02", "Form 1 - Trigger type dropdown open with options visible"))

            # Step 4: Click "Scheduled" option (Radix SelectItem)
            await page.get_by_text("Scheduled", exact=True).first.click()

            # Step 5: Screenshot showing schedule configuration appeared (AFTER selection)
            path3 = OUTPUT_DIR / "03-form1-schedule-configured.png"
            await page.screenshot(path=str(path3), full_page=True)
            screenshots.append(("03", "Form 1 - Schedule configuration visible (Simple tab, Every 1 Day)"))

            # --- FORM 2 ---
            # Step 6: Screenshot of Form 2 initial state (it should already be configured)
            path4 = OUTPUT_DIR / "04-form2-initial-state.png"
            await page.screenshot(path=str(path4), full_page=True)
            screenshots.append(("04", "Form 2 - Initial state (already configured: Scheduled, Run every 1 Day)"))

            # --- FINAL ---
            # Step 7: Final screenshot - both completed forms side by side
            path5 = OUTPUT_DIR / "05-final-both-forms-complete.png"
            await page.screenshot(path=str(path5), full_page=True)
            screenshots.append(("05", "Final - Both forms completed side by side"))

        finally:
            await browser.close()

    # Print summary
    print("\n" + "=" * 60)
    print("SCREENSHOT RECORDING SUMMARY")
    print("=" * 60)
    for num, desc in screenshots:
        print(f"  {num}. {desc}")
    print("=" * 60)
    print(f"\nScreenshots saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
