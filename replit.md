# Hamshark - Food Truck Platform

## Overview

Hamshark is a modern food truck platform that combines multi-cuisine offerings with convenience and personalization. The application serves as a comprehensive food ordering system targeting students, IT professionals, and local communities. It features real-time truck tracking, loyalty rewards, membership plans, and nutrition tracking with third-party integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built as a Single Page Application (SPA) using React with TypeScript. The architecture leverages modern React patterns including:

- **React Router**: Uses Wouter for client-side routing with path-based navigation
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with custom design system using shadcn/ui components
- **Animation**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite for fast development and optimized production builds

The UI follows a dark theme with a yellow/black color scheme, implementing a glass morphism design pattern. Components are organized using the atomic design methodology with reusable UI primitives in the `components/ui` directory.

### Backend Architecture
The backend follows a REST API pattern built with Express.js and TypeScript:

- **Framework**: Express.js with TypeScript for type safety
- **API Structure**: RESTful endpoints organized in `/server/routes.ts` with clear separation of concerns
- **Middleware**: Custom logging middleware for API request tracking
- **Storage Layer**: Abstract storage interface (`IStorage`) allowing for different implementations
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Data Storage Solutions
The application uses a PostgreSQL database with Drizzle ORM for type-safe database operations:

- **ORM**: Drizzle ORM with PostgreSQL dialect for schema definition and queries
- **Schema**: Comprehensive schema including users, menu items, orders, truck locations, loyalty rewards, and membership plans
- **Database Provider**: Neon Database as the serverless PostgreSQL provider
- **Migrations**: Drizzle Kit for schema migrations and database management

The schema includes advanced features like JSONB columns for flexible data storage (nutrition information, order items) and array fields for tags and ingredients.

### Authentication and Authorization
While authentication endpoints are defined in the storage interface, the current implementation suggests a session-based approach:

- **Session Management**: Express sessions with PostgreSQL session store
- **User Management**: Username/email-based authentication with encrypted passwords
- **Authorization**: Role-based access through membership tiers (bronze, silver, gold, shark elite)

### External Service Integrations
The platform integrates with multiple external services:

- **Payment Processing**: Razorpay integration for handling transactions
- **Health Tracking**: HealthifyMe API integration for nutrition logging
- **Food Delivery Platforms**: Swiggy and Zomato integration for expanded ordering options
- **Maps and Location**: Google Maps API for truck location tracking and geolocation services
- **Communication**: WhatsApp and email integration for receipt sharing
- **Social Media**: Instagram, Facebook, Twitter, and YouTube for social sharing

The architecture supports webhook handling for real-time updates from delivery platforms and payment processors. The system is designed to be scalable with proper separation between business logic and external service integrations.

## External Dependencies

- **Database**: PostgreSQL (Neon Database) with Drizzle ORM
- **Payment Gateway**: Razorpay for transaction processing
- **Health Integration**: HealthifyMe API for nutrition tracking
- **Food Platforms**: Swiggy and Zomato APIs for order management
- **Maps Service**: Google Maps API for location services
- **Communication**: WhatsApp Business API and email services
- **Social Platforms**: Instagram, Facebook, Twitter, and YouTube APIs
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Animation**: Framer Motion for UI animations
- **Development**: Replit-specific tooling for development environment