# Eduskill Frontend - Next.js with TypeScript

This is a Next.js application built with TypeScript that serves as the frontend for the Eduskill learning platform. The entire frontend has been converted from vanilla HTML/CSS/JavaScript to a modern React-based Next.js application.

## Project Structure

```
eduskillfrontend/
├── app/                           # Next.js App Router pages
│   ├── page.tsx                   # Home page with courses and roadmaps
│   ├── login/page.tsx             # User login page
│   ├── signup/page.tsx            # User registration page
│   ├── progresstracker/page.tsx   # Progress tracking page
│   ├── viewdetails/
│   │   └── [id]/page.tsx          # Dynamic course details pages (ids 1-8)
│   ├── layout.tsx                 # Root layout component
│   └── globals.css                # Global Tailwind CSS styles
├── components/                    # Reusable React components
│   ├── Header.tsx                 # Navigation header with login/logout
│   └── Footer.tsx                 # Footer component
├── lib/                           # Utilities and API functions
│   └── api.ts                     # Backend API client
├── public/
│   └── assets/                    # Images and static files (copied from frontend)
└── package.json                   # Dependencies and scripts
```

## Key Features

✅ **Responsive Design** - Mobile-friendly UI using Tailwind CSS  
✅ **TypeScript** - Full static type checking  
✅ **Authentication** - Login/Signup with backend integration  
✅ **Dynamic Routing** - Course details with dynamic routes  
✅ **Progress Tracking** - Interactive progress bars for course modules  
✅ **Component-Based** - Reusable Header and Footer components  
✅ **API Integration** - Connected to backend API  
✅ **Environment Variables** - Secure backend URL configuration  

## Getting Started

### Prerequisites
- Node.js v18+ 
- npm v9+

### Installation

1. Navigate to the project directory:
   ```bash
   cd frontend2/eduskillfrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=https://eduskill-1.onrender.com
   ```

### Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Pages and Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with featured courses and roadmaps |
| `/login` | User login page |
| `/signup` | User registration page |
| `/progresstracker` | Learning progress tracking dashboard |
| `/viewdetails/1` | Web Development course details |
| `/viewdetails/2` | App Development course details |
| `/viewdetails/3` | UI/UX Design course details |
| `/viewdetails/4` | Data Science course details |
| `/viewdetails/5-8` | Roadmap details pages |

## Components

### Header Component (`components/Header.tsx`)
- Sticky navigation bar with logo and menu
- Links to courses, roadmaps, and progress tracker
- Authentication UI (Login button or User profile)
- Mobile responsive hamburger menu
- Logout functionality

### Footer Component (`components/Footer.tsx`)
- Contact information
- Organized footer links
- Language selector
- Copyright notice

## API Integration

The frontend connects to the backend API at `https://eduskill-1.onrender.com`.

### API Endpoints Used:
- `POST /Profile/login` - User login
- `POST /Profile/signup` - User registration
- `POST /createOrder` - Payment order creation

All API calls are handled in `lib/api.ts`. The API client includes:
- Login function with credentials
- Signup function with user details
- Order creation for payments

## Authentication State

Authentication is managed through `localStorage`:
- `isLoggedIn` - Boolean flag (true/false)
- `userInitial` - First letter of username for profile display

## Environment Variables



Change the URL to your backend's address if needed.

## Styling

- **Framework**: Tailwind CSS v4
- **Colors**: 
  - Primary: `#FF6643` (Orange)
  - Background: `#f8f7f3` (Beige)
  - Text: `#333` (Dark gray)
- **Fonts**: Inter (Google Fonts)

## Technologies Used

- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- React Navigation (built-in Next.js Link)
- Fetch API for HTTP requests

## Conversion Notes

This project is a complete conversion from the original frontend:

| Original | Converted To |
|----------|------------|
| HTML pages | React components with Next.js pages |
| Inline CSS | Tailwind CSS classes |
| Vanilla JavaScript | TypeScript React hooks |
| Multiple HTML files | App Router structure |
| Static forms | Client-side form handling |

## Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project from GitHub
4. Add environment variables in Settings
5. Deploy with one click

### Deploy to Other Platforms
1. Build: `npm run build`
2. Start: `npm start`
3. Set environment variable `NEXT_PUBLIC_API_URL` on hosting provider

## Troubleshooting

### Images not loading
- Check that `public/assets` folder contains all image files
- Verify image file names in component code match actual files

### API connection errors
- Ensure `NEXT_PUBLIC_API_URL` is correct in `.env.local`
- Verify backend server is running and accessible
- Check browser console for CORS errors

### Login/Signup not working
- Clear browser cache and localStorage
- Check that backend API is responding
- Verify form data matches backend expectations

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

Part of the Eduskill learning platform.
