import os, time, cv2, numpy as np
from playwright.sync_api import sync_playwright

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = f"file:///{os.path.join(BASE_DIR, 'index.html').replace(os.sep, '/')}"
OUTPUT_MP4 = os.path.join(BASE_DIR, "demo", "EventPulse_AI_Demo.mp4")
TEMP_FRAMES_DIR = os.path.join(BASE_DIR, "demo", "temp_frames")

os.makedirs(TEMP_FRAMES_DIR, exist_ok=True)

print("Starting EventPulse AI Video Capture...")
frames = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    page.goto(HTML_PATH)
    page.wait_for_timeout(1000)

    def capture(duration_sec=1.0, fps=10):
        total_frames = int(duration_sec * fps)
        for _ in range(total_frames):
            buf = page.screenshot()
            nparr = np.frombuffer(buf, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            frames.append(img)
            time.sleep(1.0 / fps)

    # 1. Overview & Presets
    print("Capturing Overview & Hackathon Preset...")
    capture(2.0)

    # 2. Click Sunset Wedding
    print("Selecting Wedding Preset...")
    page.click('[data-preset="wedding"]')
    capture(2.0)

    # 3. Click Product Launch
    print("Selecting Launch Preset...")
    page.click('[data-preset="launch"]')
    capture(1.5)

    # 4. Move Guests Slider
    print("Adjusting Guest Slider...")
    page.fill("#guests-slider", "140")
    page.evaluate("document.getElementById('guests-slider').dispatchEvent(new Event('input'))")
    capture(1.5)

    # 5. Switch to Budget Tab
    print("Switching to Smart Budget Tab...")
    page.click('[data-tab="tab-budget"]')
    capture(2.5)

    # 6. Switch to Timeline Tab
    print("Switching to Timeline Tab...")
    page.click('[data-tab="tab-timeline"]')
    capture(2.5)

    # 7. Switch to Vendor Tab
    print("Switching to Vendors & Invites Tab...")
    page.click('[data-tab="tab-vendors"]')
    capture(2.0)

    # 8. Switch to AI Copilot Tab & Ask question
    print("Switching to AI Copilot Chat...")
    page.click('[data-tab="tab-copilot"]')
    capture(1.5)

    # Type first question
    page.fill("#chat-input", "What if it rains during the cocktail hour?")
    capture(1.0)
    page.click("button:has-text('Ask Copilot')")
    capture(3.0)

    # Type second question
    page.fill("#chat-input", "How do I cut 15% from catering without losing quality?")
    capture(1.0)
    page.click("button:has-text('Ask Copilot')")
    capture(3.5)

    browser.close()

print(f"Total frames captured: {len(frames)}")

# Write to MP4 using OpenCV
if frames:
    h, w, _ = frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(OUTPUT_MP4, fourcc, 10.0, (w, h))
    for f in frames:
        out.write(f)
    out.release()
    print(f"SUCCESS: Video saved to {OUTPUT_MP4} ({os.path.getsize(OUTPUT_MP4) / 1024:.1f} KB)")
