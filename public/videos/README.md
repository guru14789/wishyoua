# Video Assets

This folder contains video files used in the application.

## Background Video for Landing Page

To add your own background video for the landing page:

1. **Add your video file** to this folder:
   - Recommended name: `background.mp4`
   - Recommended format: MP4 (H.264 codec)
   - Recommended resolution: 1920x1080 or higher
   - Recommended file size: Under 10MB for faster loading

2. **Update the Home.tsx file**:
   - Locate the video element (around line 292)
   - Uncomment this line:
     ```html
     <source src="/videos/background.mp4" type="video/mp4" />
     ```
   - You can remove the external URL if you only want to use your local video

3. **Video Best Practices**:
   - Keep videos short (10-30 seconds) and loop them
   - Compress videos to reduce file size
   - Use tools like HandBrake or FFmpeg for compression
   - Test on mobile devices for performance

## Current Setup

The landing page currently uses an external video URL:
- `https://framerusercontent.com/assets/f7C7xL8Nl8X9u0k9X4.mp4`

You can replace this with your own video by following the steps above.

## Example FFmpeg Compression Command

To compress a video for web use:

```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf scale=1920:1080 -b:v 2M background.mp4
```

This will:
- Scale to 1920x1080
- Use H.264 video codec
- Set bitrate to 2Mbps
- Output as background.mp4
