from playwright.sync_api import sync_playwright
import time
import os

def verify_frontend():
    # Ensure output directory exists
    os.makedirs("/home/jules/verification", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # 1. Load the page
        print("Navigating to page...")
        page.goto("http://localhost:5174")

        # 2. Wait for SplineLoader
        print("Checking SplineLoader...")
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/loader.png")

        # 3. Wait for Loader to dismiss
        print("Waiting for loader to dismiss...")
        # Use a faster way if possible, but timer is hardcoded.
        # We can also click the "Enter Arena" button if visible.
        try:
            page.click("text=Enter Arena", timeout=2000)
            print("Clicked Enter Arena")
        except:
            print("Button not clickable yet, waiting...")

        time.sleep(6) # Ensure it's gone

        # 4. Check Hero Section
        print("Checking Hero Section...")
        page.screenshot(path="/home/jules/verification/hero.png")

        # 5. Scroll to bottom
        print("Scrolling to bottom...")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/registration.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
