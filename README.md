# Infinite Craft NextJS

## Introduction
Welcome to "Infinite Craft NextJS", an experimental project inspired by Neal Agarwal's [Infinite Craft](https://neal.fun/infinite-craft/). This simple yet engaging game combines words to create new ones using ChatGPT 3.5 by OpenAI, built on Next.js. It serves as a sandbox for experimenting with ChatGPT and React, featuring dnd-kit for drag-and-drop interactions. This project explores the integration of AI into web apps in a fun way!

Live Demo: [infinite-craft-nextjs.vercel.app](https://infinite-craft-nextjs.vercel.app/)

## Features

- **Merge Words in a Snap**: Just drag and drop two words to mash them into something new and cool.
- **Powered by ChatGPT 3.5**: Thanks to OpenAI's tech, get ready for endless word combos that'll surprise you.
- **Dark or Light Mode**: Switch it up to suit your vibe, whether you're a night owl or a daylight lover.
- **Smooth Dragging**: Super easy and slick drag-and-drop action, making mixing words fun and fuss-free.
- **Multiple Word Search Filter**: Can't find your word? No sweat. Sort, search, or filter to spotlight your discoveries or hunt for new ones.
- **Clear and Reset Button**: Messed up or want a fresh start? Hit clear to ditch the current word or reset to wipe the slate clean and begin anew.

## Technologies
This project is coded purely in NextJS, covering both frontend and backend functionalities. Key libraries and technologies used include:
- [OpenAI](https://openai.com/) for ChatGPT integration
- [dnd-kit](https://dndkit.com/) for implementing drag-and-drop functionalities
- [MongoDB](https://www.mongodb.com/) for database management
- Google Analytics for tracking user interaction

## Getting Started
Follow these steps to get the project up and running on your local machine:

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/en/) installed on your system.

### Installation
1. Clone the project to your local machine:
```bash
git clone https://github.com/dekdao/infinite-craft-nextjs.git
```
2.  Navigate to the project directory:
```bash
cd infinite-craft-nextjs
```
3. Create a `.env` file in the root directory and add your OpenAI API key, MongoDB URI, and Google Analytics Tracking Code (optional):
```bash
NEXT_PUBLIC_OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
MONGO_URI="YOUR_MONGO_DB_CONNECTION_URI"
NEXT_PUBLIC_GA_MEASUREMENT_ID="YOUR_GOOGLE_ANALYTIC_TRACKING_CODE (OPTIONAL)"
```
4. Install the necessary packages
```bash
npm install
```
5. Run the project
```bash
npm run dev
```

## Contributing

We welcome contributions from the community! If you wish to contribute to the project, please follow the standard fork and pull request process. Don't hesitate to submit new ideas, bug fixes, or enhancements.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.

## Acknowledgements

-   Inspired by Neal Agarwal's Infinite Craft
-   Thanks to OpenAI for the powerful ChatGPT models.
-   Utilizing dnd-kit for smooth drag-and-drop interactions.
