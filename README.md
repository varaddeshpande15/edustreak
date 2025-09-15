# 📚 AI-Powered Study Plan Generator

## 🚀 Overview
This project is a *Next.js-based web application* designed to enhance self-study by providing structured learning plans from YouTube playlists and PDFs. It integrates *AI-powered features* for generating study plans, summaries, quizzes, and flashcards, along with *gamification elements* to keep learners engaged.

## ✨ Features
- *YouTube Playlist to Study Plan* 📺: Extracts video insights and generates a structured learning plan.
- *PDF to Study Plan* 📄: Converts PDFs (syllabi, lecture notes, etc.) into structured study plans.
- *AI Chat Customization* 🤖: Users can refine plans in natural language using NLP techniques.
- *AI Summaries* ✍: Generates concise video summaries for quick learning.
- *AI Quiz Generator* 🎯: Creates interactive quizzes based on video content.
- *AI Flashcards* 🔥: Auto-generates flashcards for efficient revision.
- *Subdomain-Based Deployment* 🌐: Each study plan is deployed for progress tracking.
- *Gamification & Future Scope* 🎮: XP, streak badges, and a mentor connect feature (upcoming).

## 🛠 Tech Stack
- *Frontend:* [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- *AI & NLP:* [Gemini LLM (2.0 Flash)](https://ai.google.dev/), NLP techniques
- *APIs & Integrations:* [YouTube Data API](https://developers.google.com/youtube/v3)
- *Hosting & Deployment:* [Vercel](https://vercel.com/)

## 🏗 Installation & Setup
### Prerequisites
- Node.js (>= 18.x)
- npm or yarn

### Steps to Run Locally
bash
# Clone the repository
git clone https://github.com/yourusername/repo-name.git
cd repo-name

# Install dependencies
npm install  # or yarn install

# Set up environment variables
cp .env.example .env
# Add API keys for Gemini LLM, YouTube API, etc.

# Run the development server
npm run dev  # or yarn dev

Visit [http://localhost:3000](http://localhost:3000) to explore the app.

## 🏗 Deployment
This project is deployed on *Vercel*. To deploy your own version:
bash
vercel

Or set up a GitHub Actions workflow for automatic deployments.

## 📌 Usage
1. *Enter a YouTube playlist link or upload a PDF*
2. *Generate a structured study plan*
3. *Customize the plan using AI chat*
4. *Use AI-powered summaries, quizzes, and flashcards for revision*
5. *Track progress on a dedicated subdomain*

## 📅 Future Enhancements
- *Community Feature* 👥: Students can collaborate & discuss study plans.
- *Mentor Connect* 🎓: Connect with experts for guidance.
- *More Learning Resources* 📖: Support for different content sources beyond YouTube & PDFs.

## 🤝 Contributing
We welcome contributions! Feel free to submit issues, feature requests, or pull requests.

## 📜 License
This project is open-source under the [MIT License](LICENSE).

## 📬 Contact
For queries or collaborations, reach out at [your-email@example.com](mailto:your-email@example.com) or create an issue on GitHub.