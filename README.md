# SmartShopAI 🛍️🤖

SmartShopAI is a cutting-edge e-commerce platform that revolutionizes the online shopping experience by integrating Advanced AI, Augmented Reality (AR), and Virtual Try-On capabilities. Built with modern web technologies, it offers a deeply personalized, interactive, and seamless journey from product discovery to checkout.

## 🌟 Key Features

*   **AI Shopping Assistant (Powered by Gemini):** An intelligent, conversational chatbot that acts as a personal shopper. It can find products, answer complex questions, add items to your cart, and provide tailored recommendations based on your intent.
*   **Augmented Reality (AR) 3D Viewer:** View products in your real-world space. Utilizing Google's `<model-viewer>`, customers can interact with 3D models (rotate, zoom, pan) and launch AR experiences directly from the browser on supported devices.
*   **Virtual Try-On (Beta):** A responsive, intuitive tool allowing users to upload a photo of themselves and overlay product "stickers" to visualize how apparel or accessories might look.
*   **Dynamic UI & Animations:** Beautifully crafted with Tailwind CSS featuring glassmorphism, glowing RGB borders on buttons, micro-animations, and smooth transitions for a premium feel.
*   **Real-time Dynamic Pricing Indicators:** Simulates live demand to create urgency and a dynamic shopping environment.
*   **Fully Functional E-Commerce Flow:** Includes categorized browsing, price filtering, a responsive shopping cart, user authentication (mocked), and distinct sections like Flash Deals, Best Sellers, and New Arrivals.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19 (TypeScript)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (with custom animations and utility classes)
*   **AI Integration:** `@google/genai` (Google Gemini API) for conversational commerce.
*   **3D/AR Rendering:** Google Model Viewer (`@google/model-viewer`)

## 🚀 How to Run the Project

Follow these instructions to run SmartShopAI locally on your machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (Version 18+ recommended)
*   npm (comes with Node.js)
*   A Gemini API Key (for the AI Chat functionality to work).

### 1. Clone the repository
Ensure you are in the project directory. If you just cloned it:
```bash
cd SmartShopAI-main
```

### 2. Install Dependencies
Run the following command to install all required npm packages:
```bash
npm install
```

### 3. Environment Setup
You need to set up your environment variables for the Gemini API.
Create a `.env` file in the root directory (if it doesn't exist) and add your API key:
```env
VITE_GEMINI_API_KEY="your_api_key_here"
```
*(Note: Never commit your actual API key to version control)*

### 4. Start the Development Server
Run the Vite development server:
```bash
npm run dev
```

### 5. Open the Application
Once the server starts, it will provide a local URL (typically `http://localhost:5173/`). Open this URL in your web browser to start exploring SmartShopAI!

## 📦 Building for Production

To create a production-ready build, run:
```bash
npm run build
```
This will compile the TypeScript code and bundle the assets into the `dist/` directory. You can preview the production build locally using `npm run preview`.

## 📂 Project Structure

*   `App.tsx`: Main application orchestrator managing state (cart, user, views) and rendering the core layout.
*   `components/`: Reusable React components.
    *   `ChatInterface.tsx`: The Gemini-powered AI assistant window.
    *   `Header.tsx`: Navigation, search bar, and cart toggle.
    *   `ProductCard.tsx`: Individual product display components.
    *   `SignIn.tsx`: User authentication view.
*   `services/geminiService.ts`: Abstraction layer for interacting with the Google GenAI SDK.
*   `constants.ts`: Mock data for products, categories, and initial states.
  
View this project : https://smart-shop-ai-liard.vercel.app/
---
*Built with ❤️ to redefine retail.*
