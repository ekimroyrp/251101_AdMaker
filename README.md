# 251101_AdMaker

251101_AdMaker is a local-first playground for crafting AI-generated creative assets. It combines an intuitive React interface with a lightweight Node proxy so you can iterate on ad concepts, swap aspect ratios, and preview results without exposing your OpenAI API key to the browser.

## Features
- Aspect ratio presets that instantly resize the preview canvas to match campaign requirements.
- Prompt-driven image generation backed by OpenAI's `gpt-image-1` model.
- Responsive preview area that displays generated artwork inline as a data URL for quick iteration or download.
- Local proxy server that keeps your OpenAI API key safe on your own machine while the UI runs in the browser.

## Getting Started
1. **Clone & install**  
   ```bash
   git clone https://github.com/ekimroyrp/251101_AdMaker.git
   cd 251101_AdMaker
   npm install --prefix client
   npm install --prefix server
   ```
2. **Configure environment**  
   Copy `server/.env.example` to `server/.env`, then add your `OPENAI_API_KEY`. Adjust `PORT` or `CLIENT_ORIGIN` if you change dev ports.
3. **Run locally**  
   In separate terminals, start the backend (`npm run dev --prefix server`) and the frontend (`npm run dev --prefix client`). Open your browser to `http://localhost:5173`.

## Controls
- **Aspect Ratio Selector**: Choose the desired output shape; the black preview frame resizes immediately.
- **Prompt Textarea**: Describe the desired scene, subject, and style for image generation.
- **Generate Image Button**: Sends the prompt and ratio to the backend and displays the resulting artwork.
- **Reset Button**: Clears the prompt, preview, and any error messages so you can iterate quickly.

## Deployment
- **Local production preview:** From the repo root run `npm run build --prefix client` followed by `npm run preview --prefix client` to serve the compiled bundle locally.
- **Publish to GitHub Pages:** Build the client (`npm run build --prefix client`), copy the contents of `client/dist/` into the `gh-pages` branch (be sure to include a `.nojekyll` file), commit, and `git push origin gh-pages`.
- **Live demo:** https://ekimroyrp.github.io/251101_AdMaker/
