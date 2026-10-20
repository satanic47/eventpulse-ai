import os, time, cv2, subprocess, numpy as np
from playwright.sync_api import sync_playwright
from moviepy.config import FFMPEG_BINARY

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = f"file:///{os.path.join(BASE_DIR, 'index.html').replace(os.sep, '/')}"
AUDIO_PATH = os.path.join(BASE_DIR, "demo", "voiceover.mp3")
TEMP_VIDEO = os.path.join(BASE_DIR, "demo", "temp_raw_video.mp4")
FINAL_MP4 = os.path.join(BASE_DIR, "demo", "EventPulse_AI_Demo.mp4")

FPS = 12

print("Step 1: Capturing synced browser frames...")
frames = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    page.goto(HTML_PATH)
    page.wait_for_timeout(1000)

    def capture_for(seconds):
        num_frames = int(seconds * FPS)
        for _ in range(num_frames):
            buf = page.screenshot()
            nparr = np.frombuffer(buf, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            frames.append(img)
            time.sleep(1.0 / FPS)

    # 1. 0.0s - 7.5s: Intro & Hackathon preset
    print("Section 1: Intro...")
    capture_for(7.5)

    # 2. 7.5s - 15.0s: Presets (Wedding -> Launch)
    print("Section 2: Archetypes...")
    page.click('[data-preset="wedding"]')
    capture_for(3.5)
    page.click('[data-preset="launch"]')
    capture_for(4.0)

    # 3. 15.0s - 23.0s: Sliders & Dynamic Math
    print("Section 3: Sliders & Context...")
    page.fill("#guests-slider", "160")
    page.evaluate("document.getElementById('guests-slider').dispatchEvent(new Event('input'))")
    capture_for(4.0)
    page.fill("#budget-slider", "24000")
    page.evaluate("document.getElementById('budget-slider').dispatchEvent(new Event('input'))")
    capture_for(4.0)

    # 4. 23.0s - 33.0s: Tab 2 (Budget & Beverages)
    print("Section 4: Budget & Drinks...")
    page.click('[data-tab="tab-budget"]')
    capture_for(10.0)

    # 5. 33.0s - 43.0s: Tab 3 (Timeline) & Tab 4 (Vendors)
    print("Section 5: Timeline & Vendors...")
    page.click('[data-tab="tab-timeline"]')
    capture_for(5.0)
    page.click('[data-tab="tab-vendors"]')
    capture_for(5.0)

    # 6. 43.0s - 52.0s: Tab 5 (AI Copilot Chat) & Finale
    print("Section 6: AI Copilot...")
    page.click('[data-tab="tab-copilot"]')
    capture_for(2.0)
    page.fill("#chat-input", "What if it rains during the cocktail hour?")
    capture_for(1.5)
    page.click("button:has-text('Ask Copilot')")
    capture_for(5.5)

    browser.close()

print(f"Captured {len(frames)} frames. Writing raw video...")
h, w, _ = frames[0].shape
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
writer = cv2.VideoWriter(TEMP_VIDEO, fourcc, float(FPS), (w, h))
for f in frames:
    writer.write(f)
writer.release()
print("Raw video written successfully.")

# Step 2: Merge audio and video using FFmpeg
print("Step 2: Merging audio and video with FFmpeg...")
cmd = [
    FFMPEG_BINARY,
    "-y",
    "-i", TEMP_VIDEO,
    "-i", AUDIO_PATH,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    FINAL_MP4
]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"SUCCESS! Final voiced video created at {FINAL_MP4}")
    print(f"File size: {os.path.getsize(FINAL_MP4) / (1024 * 1024):.2f} MB")
    if os.path.exists(TEMP_VIDEO):
        os.remove(TEMP_VIDEO)
else:
    print("FFmpeg error:", res.stderr)
