# Prozo: Event Staffing

Build a modern, responsive Web Application called "Prozo" – an on-demand marketplace connecting event organizers with vetted, certified event professionals (lifeguards, security guards, medics, and event photographers).

The design should be sleek, premium, and clean (dark mode inspired or modern slate with vibrant blue/indigo accents, using Tailwind CSS and shadcn/ui components). The app should support Right-to-Left (RTL) text direction for Hebrew.

Key Product Requirements & User Flows:

1. Landing Page (Hero & Search Bar):

- Top Navbar with Prozo logo, "Join as a Pro" link, and a "Pro Login" button.

- Hero section emphasizing safety, certified staff, and fast booking without friction.

- Prominent Search Box with filters:

  * Profession: Pool Lifeguard, Security / Bouncer, Medic / First Aid, Event Photographer.

  * Location / City input.

  * Date picker and estimated duration (hours).

  * "Find Pros" call-to-action button.

2. Frictionless Client Flow (No upfront registration required):

- Clients do NOT need an account to search, view profiles, or complete a booking.

- Results Page displaying provider cards with: avatar, full name, profession tag, hourly rate, verified badge, rating, and location.

- Detailed Provider Profile Modal/Page: bio, certifications listed, portfolio/image gallery (especially for photographers), reviews, and an interactive booking summary card.

- Checkout / Booking Flow:

  * Client enters event location, date, start/end hours.

  * Client provides basic contact details (Full Name, Phone Number, Email) for booking updates.

  * Summary showing subtotal, platform fee, and total price.

  * Mock payment interface (Card details input) simulating an escrow/authorization hold.

  * Confirmation screen with a reference booking code and a status timeline.

3. Professional / Provider Portal (Requires Authentication):

- Onboarding & Registration form: full name, phone, email, password, profession selection, hourly rate, minimum hours, and service radius.

- Document Verification upload section (placeholders for ID, professional certificates, first aid refreshers) with status badges (Pending Review, Approved).

- Availability Calendar: an intuitive weekly/monthly schedule where pros can toggle available time slots or block specific hours.

- Provider Dashboard: overview of incoming booking requests (with "Accept" / "Decline" actions), upcoming confirmed shifts, and total earnings.

4. Mock Data & State Management:

- Pre-populate the app with realistic mock professionals across all 4 categories with Hebrew names, cities (Tel Aviv, Herzliya, Haifa, Rishon LeZion, Jerusalem), hourly rates, and high-quality profile photos.

- Implement responsive design optimized for mobile and desktop screens.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c766559-1aa5-5b08-b074-aeb49d30c8be).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
