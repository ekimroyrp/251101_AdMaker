# Ad Maker Image Generator

Ad Maker Image Generator is a local-first playground for crafting AI-generated creative assets. It combines an intuitive React interface with a lightweight Node proxy so you can experiment with prompt ideas, swap aspect ratios, and preview results without exposing your OpenAI API key to the browser.

## Features
- Aspect ratio presets that instantly resize the preview canvas to match campaign requirements.
- Prompt-driven image generation backed by OpenAI’s `gpt-image-1` model.
- Responsive preview area that displays generated artwork inline as a data URL.
- Local proxy server that keeps your OpenAI API key safe on your own machine.

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
   In separate terminals, start the backend (`npm run dev --prefix server`) and frontend (`npm run dev --prefix client`). Open your browser to `http://localhost:5173`.

## Controls
- **Aspect Ratio Selector**: Choose the desired output shape; the black preview frame resizes immediately.
- **Prompt Textarea**: Describe the desired scene, subject, and style for image generation.
- **Generate Image Button**: Sends the prompt and ratio to the backend and displays the resulting artwork.
- **Reset Button**: Clears the prompt, preview, and any error messages so you can iterate quickly.
