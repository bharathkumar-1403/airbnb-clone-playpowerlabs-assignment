# StayNest --- Airbnb-Style Vacation Rental Marketplace

StayNest is a frontend-focused vacation-rental marketplace built for the
PlayPower Labs Airbnb Clone assignment.

## Features

-   Responsive homepage
-   Property search and listing discovery
-   Check-in and check-out date selection
-   Guest selection
-   Search state carried into the selected property flow
-   Property detail pages
-   Property photo gallery
-   Photo Tour and Lightbox interactions
-   Checkout flow
-   Booking confirmation
-   My Trips page
-   Booking cancellation
-   Browser localStorage booking persistence
-   Responsive UI
-   Production-scale architecture diagram

## Tech Stack

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Browser localStorage for the current MVP
-   Vercel-compatible deployment architecture

The assignment permits browser/frontend storage when a backend is not
required for a focused implementation.

## Project Structure

``` text
airbnb-clone/
├── app/
│   ├── checkout/page.tsx
│   ├── listing/[id]/page.tsx
│   ├── my-trips/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   └── StayNest_Architecture_Diagram.pdf
├── public/
├── AGENTS.md
├── CLAUDE.md
├── AI_USAGE.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

### Install dependencies

``` bash
npm install
```

### Run development server

``` bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

``` bash
npm run build
```

### Start production server

``` bash
npm start
```

## Main User Flow

``` text
Homepage
  ↓
Select destination / dates / guests
  ↓
Search
  ↓
Select property
  ↓
Property details
  ↓
Photo Tour / Lightbox
  ↓
Checkout
  ↓
Confirm booking
  ↓
My Trips
  ↓
View or cancel booking
```

## Booking Persistence

Confirmed bookings are stored in browser localStorage using:

``` text
staynest_bookings
```

This is suitable for the current assignment MVP. A production
implementation should move booking, user and availability data to a
server-side database and validate bookings on the server.

## Architecture

The repository contains:

``` text
docs/StayNest_Architecture_Diagram.pdf
```

The diagram covers users, CDN/edge delivery, Next.js frontend,
backend/API services, search, database/cache, object storage,
deployment/scaling, and operations/monitoring.

## AI-Assisted Development

AI tools were used as development and problem-solving assistants.

AI assistance was used for:

-   React / Next.js component development
-   TypeScript and JSX debugging
-   UI refinement and responsive styling
-   Booking and checkout flows
-   Photo Tour and Lightbox interactions
-   My Trips implementation
-   Page navigation
-   Reviewing implementation issues
-   Documentation and architecture planning

Generated output was reviewed, integrated, tested and modified as
necessary rather than being accepted without verification.

Detailed AI-development notes are in `AI_USAGE.md`.

The project also includes:

``` text
AGENTS.md
CLAUDE.md
```

## Security Considerations

The current project is an assignment-focused frontend MVP and does not
process real payments.

A production implementation should add:

-   Server-side validation
-   Authentication and authorization
-   Secure payment processing
-   Rate limiting
-   Secure environment variables
-   Protection against common web vulnerabilities
-   Secure booking and user-data handling
-   Database access controls
-   Server-side availability validation

## Production Deployment

A production deployment can use a CDN/edge layer in front of the Next.js
application, with independent API, search, database/cache and
object-storage services.

``` text
Users
  ↓
CDN / Edge
  ↓
Next.js Application
  ↓
API Services
  ├── Database / Cache
  ├── Search Service
  └── Object Storage
```

Autoscaling, caching, logging, monitoring and secure environment
configuration should be used for production workloads.

## Assignment Deliverables

The final submission should contain:

1.  Complete application source code
2.  Architecture diagram
3.  AI/sub-agent configuration files
4.  AI usage documentation and prompt sequence
5.  README

The assignment requires the deliverables to be submitted as a ZIP and
specifically says not to push the code to a public GitHub repository.

## Project

**StayNest --- Vacation Rental Marketplace**

Built as an Airbnb-style clone for the PlayPower Labs assignment.
