# UBroke - Personal Finance App

A modern React Native app built with Expo for managing personal finances with a Gen Z-friendly interface.

## Features

- 📧 **Email Authentication** with Supabase
  - Sign up with email verification
  - Password reset functionality
  - Secure user sessions
- 🔐 **Google OAuth** integration
- 📱 **Cross-platform** (iOS, Android, Web)
- 💰 **Financial tracking** and budgeting
- 🎯 **Goal setting** and progress tracking
- 📊 **Spending insights** and analytics

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- A Supabase account and project

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ubroke/ubroke-fe
npm install
```

### 2. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Fill in your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

Run this SQL in your Supabase SQL editor to create the user profiles table:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  age INTEGER,
  account_count INTEGER,
  assets DECIMAL,
  liabilities DECIMAL,
  salary DECIMAL,
  salary_frequency TEXT CHECK (salary_frequency IN ('weekly', 'biweekly', 'monthly')),
  next_pay_date DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 4. Authentication Settings

In your Supabase dashboard, go to **Authentication > Settings**:

1. **Site URL**:

   - Development: `http://localhost:3000`
   - Production: Your domain

2. **Redirect URLs**:

   - `http://localhost:3000/auth/callback`
   - `ubroke://auth/callback`
   - `http://localhost:19006/auth/callback` (for Expo web)

3. **Email Templates**: Customize under Authentication > Email Templates

### 5. Run the App

```bash
# Start the development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web
```

## Email Authentication Features

### ✅ What's Working

- **Sign Up**: Users can create accounts with email/password
- **Email Verification**: Automatic verification emails sent
- **Sign In**: Secure password-based authentication
- **Password Reset**: Users can reset forgotten passwords
- **Profile Creation**: Automatic user profile setup after signup
- **Verification Resend**: Users can resend verification emails

### 🔧 Setup Requirements

1. **Environment Variables**: Configure your `.env` file
2. **Database Schema**: Run the SQL above to create necessary tables
3. **Redirect URLs**: Configure in Supabase dashboard
4. **Email Templates**: Customize verification and reset emails

### 📱 User Flow

1. **Sign Up**: User enters email, password, and name
2. **Verification**: Email sent with verification link
3. **Verification Complete**: User clicks link, gets redirected to app
4. **Onboarding**: Complete profile setup if needed
5. **Dashboard**: Access main app features

### 🛠️ Development Notes

- Email verification is required by default
- Password reset links expire in 24 hours
- User profiles are automatically created after signup
- All auth state changes are handled reactively

## Project Structure

```
ubroke-fe/
├── app/
│   ├── (tabs)/              # Main app screens
│   ├── onboarding/          # Onboarding flow
│   ├── auth/                # Authentication screens
│   └── _layout.tsx          # Root navigation
├── components/              # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # External service configs
└── constants/               # App constants
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]
