# Demo & Recording Guide

## Demo Video Recording

### Tools (Pick one):

**Windows:**

- **OBS Studio** (Free, professional) - [obsproject.com](https://obsproject.com)
- **ScreenFlow** or **Camtasia** (Paid, easy to use)
- **ShareX** (Free, lightweight)

**Mac:**

- **ScreenFlow** (Built-in alternative: QuickTime)
- **OBS Studio** (Free)

**Web-based (no install needed):**

- **Loom** - [loom.com](https://loom.com) - Easy recording + automatic GIF conversion
- **Screencastify** (Chrome extension)

### Recording Checklist

1. **Setup**

   - Open TelcoFlow in browser
   - Make sure you have good lighting
   - Close unnecessary tabs/notifications

2. **Demo Script** (~3-5 minutes)

   - [ ] **Intro** (20s): "TelcoFlow - Low-code call flow builder"
   - [ ] **Show Node Library** (30s): Drag some nodes to canvas
   - [ ] **Create a Flow** (60s): Build simple decision flow
   - [ ] **Simulator** (60s): Run the flow, show logs & metrics
   - [ ] **Templates** (30s): Load a template, show how easy it is
   - [ ] **Exports** (30s): Show PNG, PDF, Markdown exports
   - [ ] **Outro** (20s): "Ready for production!"

3. **Recording Tips**
   - Slow down your movements so it's easy to follow
   - Use cursor highlights (OBS has this feature)
   - Add captions/text overlays if possible
   - Don't rush - pause between actions

### Converting to GIF

If you have video file:

**Using FFmpeg (fast, free):**

```bash
# Install (Windows): choco install ffmpeg
# Install (Mac): brew install ffmpeg

# Convert MP4 to GIF (optimized)
ffmpeg -i demo.mp4 -vf "fps=10,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palgen[p];[s1][p]paletteuse" demo.gif

# Or simpler version:
ffmpeg -i demo.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p demo.webp
```

**Online Tools (no install):**

- [ezgif.com](https://ezgif.com) - Upload MP4, download GIF
- [Kapwing](https://www.kapwing.com) - Video to GIF converter
- [CloudConvert](https://cloudconvert.com) - Various formats

### Loom (Easiest - Auto GIF)

1. Go to [loom.com](https://loom.com)
2. Record your demo
3. Loom automatically creates shareable link + GIF
4. No editing needed!

### Where to Store Demo

- **GitHub README** - Add GIF to main section
- **LinkedIn** - Link to Loom video
- **Interview prep** - Have local copy + cloud link backup

---

## Custom Domain Setup

### For Vercel

1. **Get a Domain**

   - [Namecheap](https://namecheap.com)
   - [Google Domains](https://domains.google.com)
   - [Vercel Domains](https://vercel.com/domains)

2. **Connect to Vercel**

   - Go to Vercel Dashboard → Your Project
   - Settings → Domains
   - Enter your domain (e.g., `telcoflow.dev`)
   - Vercel will show DNS records to add

3. **Update DNS** (at your domain registrar)

   - Add Vercel nameservers OR A records
   - Wait 24-48 hours for DNS propagation

4. **Verify**
   ```bash
   nslookup your-domain.com
   ```

### For Netlify

1. Settings → Domain Management
2. Add custom domain
3. Follow Netlify's DNS instructions
4. Same as above - wait for propagation

### Quick Domain Options

**Cheap & Easy:**

- `.dev` on Namecheap: $10-15/year
- `.app` on Google Domains: $12/year
- `.tech` on Namecheap: $2-3/year (first year)

**Recommended for Portfolio:**

- `telcoflow.dev` - Professional
- `bobradisavljevic.dev` - Personal branding
- `telcoflow-demo.app` - Clear intent

---

## Interview Talking Points

When showing the demo:

> "TelcoFlow is a low-code visual flow builder for telecom service development. In just 4 weeks, I built a production-ready platform with:
>
> - **12+ node types** for IVR, transfers, queues, API calls
> - **Live simulator** with execution logs and metrics
> - **Multiple export formats** (JSON, PNG, PDF, Markdown)
> - **Template library** for quick starts
> - **Docker & Vercel deployment** ready
>
> The architecture is fully type-safe TypeScript with Zustand for state, ReactFlow for visualization, and a custom expression evaluator that safely executes conditions without eval()."

---

## Recording Examples (What to Show)

### Quick Demo Flow (2 minutes)

1. Load "Customer Support IVR" template
2. Show nodes: Start → IVR → Decision
3. Run simulator
4. Show metrics and logs
5. Export as PNG/PDF

### Advanced Flow (3 minutes)

1. Create new flow from scratch
2. Drag nodes: Start → Set Variable → Decision → API Call → End
3. Configure nodes (show form validation)
4. Test with simulator
5. Show all export options

---

Next Steps:

1. Record demo (recommend: Loom - easiest)
2. Get custom domain ($10-15)
3. Add domain to Vercel (5 min)
4. Update README with demo link
5. Share with team/prepare for interview
