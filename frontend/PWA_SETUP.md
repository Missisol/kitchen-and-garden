# Progressive Web App (PWA) Setup

This application has been configured as a Progressive Web App (PWA) using `vite-plugin-pwa`.

## Features

- **Offline Support**: Service worker caches assets and API responses
- **Installable**: Users can install the app on their devices
- **App-like Experience**: Standalone display mode when installed
- **Auto-updates**: Service worker automatically updates when new versions are available

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install `vite-plugin-pwa` along with other dependencies.

### 2. Generate PWA Icons

You need to create two icon files in the `public/` directory:

- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)

#### Option A: Using ImageMagick (if installed)

```bash
convert -background none -resize 192x192 public/favicon.svg public/pwa-192x192.png
convert -background none -resize 512x512 public/favicon.svg public/pwa-512x512.png
```

#### Option B: Using Online Tools

1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/) or [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload `public/favicon.svg`
3. Generate and download the icons
4. Save them as `pwa-192x192.png` and `pwa-512x512.png` in the `public/` directory

#### Option C: Using Node.js with sharp

```bash
npm install -D sharp
node scripts/generate-icons.js
```

(Note: You'll need to update the script to use sharp for actual icon generation)

### 3. Build the Application

```bash
npm run build
```

The PWA manifest and service worker will be automatically generated during the build process.

### 4. Test the PWA

1. Serve the built application:
   ```bash
   npm run preview
   ```

2. Open the application in a browser
3. Check the browser's developer tools for PWA installation prompts
4. Test offline functionality by going offline and refreshing the page

## Configuration

The PWA configuration is located in `vite.config.js`. Key settings:

- **App Name**: "Кухня и сад"
- **Theme Color**: #15ba67 (green)
- **Display Mode**: standalone
- **Icons**: 192x192 and 512x512 PNG files
- **Service Worker**: Auto-updates enabled with caching strategies

## Service Worker

The service worker is automatically generated and includes:

- **Asset Caching**: All JS, CSS, HTML, and image files are cached
- **API Caching**: API responses are cached with NetworkFirst strategy
- **Offline Support**: Cached content is served when offline

## Browser Support

PWAs are supported in:
- Chrome/Edge (Android & Desktop)
- Safari (iOS 11.3+)
- Firefox (Android)
- Samsung Internet

## Troubleshooting

### Icons not showing
- Ensure `pwa-192x192.png` and `pwa-512x512.png` exist in the `public/` directory
- Clear browser cache and rebuild the application

### Service worker not updating
- Clear browser cache and service worker storage
- Check browser console for service worker errors

### Installation prompt not appearing
- Ensure the app is served over HTTPS (or localhost)
- Check that all required PWA features are present (manifest, service worker, icons)


