# UBroke Onboarding Structure

## Overview

The onboarding flow has been restructured as individual pages/routes instead of slides within a container. Each step is now a separate page with its own URL, making navigation cleaner and more modular.

## Page Structure

### 1. Welcome Page (`/onboarding/welcome`)

- **Purpose**: Brand introduction with Gen Z-friendly vibe
- **Features**:
  - Bouncing coin animation (🪙)
  - Neon green gradient background
  - "Get Started" button navigates to authentication
- **Navigation**: → `/onboarding/auth`

### 2. Authentication Page (`/onboarding/auth`)

- **Purpose**: User sign-up/login with Firebase integration
- **Features**:
  - Toggle between Sign Up/Login
  - Email/password validation
  - Google OAuth integration (ready for implementation)
  - Form validation with user-friendly error messages
- **Data Stored**: User email
- **Navigation**: → `/onboarding/profile`

### 3. Profile Setup Page (`/onboarding/profile`)

- **Purpose**: Collect basic user information and financial data
- **Features**:
  - Progress bar (Step 1 of 2, 50% complete)
  - Name, age, account count inputs
  - Optional assets/liabilities with currency formatting
  - Skip option available
- **Data Stored**: User profile information
- **Navigation**: → `/onboarding/income`

### 4. Income Setup Page (`/onboarding/income`)

- **Purpose**: Collect salary and paydate information
- **Features**:
  - Progress bar (Step 2 of 2, 100% complete)
  - Salary input with frequency selection
  - Next paydate picker
  - Real-time salary breakdown calculations
  - Skip option available
- **Data Stored**: Income details for cashflow tracking
- **Navigation**: → `/onboarding/tutorial`

### 5. Tutorial Page (`/onboarding/tutorial`)

- **Purpose**: App overview and transaction setup
- **Features**:
  - 3-slide tutorial carousel about app features
  - Quick action buttons (Upload Statement, Add Transaction)
  - Option to skip directly to main app
  - Completes onboarding flow
- **Navigation**: → `/(tabs)` (Main App)

## Technical Implementation

### Route Structure

```
app/
├── onboarding/
│   ├── _layout.tsx          # Onboarding stack navigator
│   ├── welcome.tsx          # Welcome/brand intro page
│   ├── auth.tsx             # Authentication page
│   ├── profile.tsx          # Profile setup page
│   ├── income.tsx           # Income setup page
│   └── tutorial.tsx         # Tutorial and completion page
├── (tabs)/                  # Main app tabs
└── _layout.tsx              # Root layout with onboarding detection
```

### Data Flow

- **Storage**: AsyncStorage for persistence
- **State Management**: Custom `useOnboarding` hook
- **Data Structure**: Typed `OnboardingData` interface
- **Navigation**: Expo Router with programmatic navigation

### Key Features

- ✅ **Individual Pages**: Each step is a separate route
- ✅ **Progress Tracking**: Visual progress bars where appropriate
- ✅ **Data Persistence**: All user input saved to AsyncStorage
- ✅ **Skip Options**: Users can skip optional steps
- ✅ **Form Validation**: Client-side validation with error handling
- ✅ **Smooth Animations**: Page transitions and UI animations
- ✅ **Debug Tools**: Reset onboarding capability for testing

## Color Scheme

- **Primary**: Neon Green `#00FF7F`
- **Secondary**: Hot Pink `#FF69B4`
- **Accent**: Yellow `#FFFF00`
- **Backgrounds**: Gradient combinations for visual appeal

## Testing

Use the debug tab (🔧) in the main app to reset onboarding and test the flow again.

## Future Enhancements

- Firebase Authentication integration
- Bank statement upload functionality
- Manual transaction entry
- Enhanced tutorial interactions
- Progress persistence across app restarts
