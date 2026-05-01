# FitAI LiftMate Buddy

Your AI-powered fitness companion for personalized workout guidance, progress tracking, and pose estimation.

## Features

- **AI Chat Interface** - Get personalized fitness advice and workout guidance from your AI coach
- **Workout Library** - Browse and explore a comprehensive collection of exercises
- **Pose Estimation** - Real-time pose detection to ensure proper form during workouts
- **Goal Setting** - Define and track your fitness goals
- **Progress Dashboard** - Monitor your fitness journey with visual progress tracking
- **Workout Sessions** - Create and manage customized workout sessions
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Package Manager**: Bun
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 16+ (or Bun)
- npm, yarn, or bun package manager

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd fit-ai-liftmate-buddy

# Install dependencies
npm install
# or
bun install
```

### Development

```sh
# Start the development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```sh
# Build the application
npm run build
# or
bun run build

# Preview the production build
npm run preview
# or
bun run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface   # AI chat component
│   ├── GoalSetting     # Goal setting interface
│   ├── PoseEstimation  # Pose detection component
│   ├── ProgressDashboard # Progress tracking
│   ├── WorkoutSession  # Workout session management
│   ├── WorkoutLibrary  # Workout catalog
│   ├── Navigation      # Navigation component
│   └── ui/             # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets
└── styles/             # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
