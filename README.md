# Cleaning Sewa App

Professional Cleaning Service Mobile & Web Application for Nepal built with Expo, React Native, and Expo Router.

## Documentation
Full system and architecture documentation is available in [DOCUMENTATION.md](DOCUMENTATION.md).

## Vercel Deployment
The web version is configured for automatic deployment on Vercel via [vercel.json](vercel.json):
- **Build Command**: `npx expo export -p web` or `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings.

## Features
- **Comprehensive Cleaning Services**: Explore deep home cleaning, sofa/carpet cleaning, AC maintenance, post-construction cleanup, and more.
- **Service Booking & Payments**: Book services with customizable budgets and simulated eSewa payment integration.
- **User & Pro Dashboards**: Dedicated interfaces for customers and service professionals.
- **Support & Location**: Integrated WhatsApp quick chat and Sriyog Consulting location mapping.
- **Dark Mode Support**: Full theme customization using ThemeContext.

## Tech Stack
- **Framework**: Expo / React Native Web
- **Hosting / Continuous Deployment**: Vercel
- **Navigation**: Expo Router & React Navigation Drawer/Tabs
- **Backend / Database**: Supabase (`idzvconrzundcqkiibmh`) & PostgreSQL
- **Payments**: eSewa Payment Gateway Integration
- **Styling**: React Native StyleSheet & Expo LinearGradient
- **Storage**: AsyncStorage & Redux
