# LegalTendr - Mobile-First React Prototype

LegalTendr is a Tinder-style matching platform that connects clients with lawyers. This prototype focuses on the client-side experience with an emphasis on mobile-first design and a smooth swiping interface.

![LegalTendr App](https://i.imgur.com/placeholder.png)

## Features

- **Mobile-First UI/UX**: Interface designed to look and feel like a native mobile application
- **Tinder-Style Swiping**: Fluid, intuitive card swiping interface for lawyer discovery
- **Authentication**: Simple login system with hardcoded credentials (client@test.com / password)
- **Interactive Navigation**: Tab-based navigation with active state indicators
- **Mock Data**: Includes realistic lawyer profiles, cases, and messages

## Tech Stack

- **Framework**: React with Vite
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Swiping**: React Tinder Card

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

```bash
# Clone the repository (if applicable)
# git clone https://github.com/yourusername/legal-tendr.git

# Navigate to the project directory
cd legal-tendr

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Login Credentials

- **Email**: client@test.com
- **Password**: password

## Pages

1. **Login**: Authentication screen with email/password fields and social login options
2. **Dashboard**: Overview of recent cases, messages, and quick action links
3. **Discover**: Tinder-style card swiping interface to match with lawyers
4. **My Cases**: List of active and pending legal cases
5. **Messages**: Conversation list with matched lawyers
6. **Account**: User profile and settings management

## Color Scheme

The app uses a monochromatic color scheme based on #FD484F (vibrant red).

## Development Notes

- This is a prototype and not intended for production use
- All data is mocked and stored locally in the app
- The UI is optimized for mobile devices but will work on desktop browsers
