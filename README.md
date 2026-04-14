<div align="center">
  <img src="public/icon.png" alt="rezumeAI Logo" width="120" />
</div>

# rezumeAI 🚀

> **rezumeAI** is a powerful, standalone web application that seamlessly edits, modernizes, and enhances your raw resume using the power of AI.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Features
- **Grammarly-Style AI Editor**: An elegant dual-panel editor that analyzes your uploaded resume and provides in-line AI suggestions targeted specifically for your desired job role.
- **Smart PDF Extraction**: Built-in intelligence to accurately pull out structure and content directly from PDF resume uploads without missing a beat.
- **Privacy-First API Secrets**: Secure server-side `.env` key integrations ensure users don't have to provide their own OpenAI/OpenRouter keys.
- **Real-time Previews & Export**: View beautifully rendered layouts of your resume dynamically while editing, and download it safely to PDF format.
- **Dark Mode Compatibility**: A meticulously styled interface supporting seamless dark mode for late-night editing sessions.

## Quick Start
To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or above recommended)
- npm or pnpm

### Installation
1. Clone the repository
   ```sh
   git clone https://github.com/Dhruv191101/rezume-ai.git
   ```
2. Navigate to the local directory
   ```sh
   cd rezume-ai
   ```
3. Install dependencies
   ```sh
   npm install
   ```
4. Create an `.env` file in the root directory and add your AI credentials:
   ```env
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```
5. Run the dev server
   ```sh
   npm run dev
   ```

## Built With
- **[React](https://reactjs.org/)** & **[Vite](https://vitejs.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Radix UI](https://www.radix-ui.com/)**
- **[PDF.js](https://mozilla.github.io/pdf.js/)**
- AI integrated via **OpenRouter** 

## License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
