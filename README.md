# USTP Cafeteria Staff Portal - Frontend Only

A React JSX frontend application for the USTP (University of Science and Technology of the Philippines) Cafeteria Staff Portal. This is a UI-only version with mock data and no backend integration.

## Features

- **Authentication UI**: Login and registration forms with validation
- **Dashboard**: Overview of cafeteria operations with mock statistics
- **Order Management**: View and manage food orders with status updates
- **Responsive Design**: Works on desktop and mobile devices
- **Mock Data**: All functionality uses local mock data for demonstration

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks with mock data
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   └── assets/        # Images and static assets
├── index.html
└── package.json
```

## Mock Data & Backend Integration

This project is designed to be frontend-only with mock data. All API calls have been replaced with:

- Mock functions that simulate API responses
- Local state management for data persistence
- Console.log statements for debugging
- TODO comments indicating where backend integration should be added

### Key Mock Areas

1. **Authentication** (`hooks/use-auth.jsx`):
   - Mock login/register with localStorage persistence
   - TODO: Replace with actual API calls

2. **Order Management** (`hooks/use-orders.jsx`):
   - Mock order data and CRUD operations
   - TODO: Connect to real order management API

3. **API Client** (`lib/queryClient.js`):
   - Mock API request functions
   - TODO: Replace with actual fetch calls to backend

## Adding Backend Integration

To connect this frontend to a backend:

1. Search for `// TODO: backend integration` comments throughout the codebase
2. Replace mock functions with actual API calls
3. Update the `apiRequest` function in `lib/queryClient.js`
4. Configure proper authentication endpoints
5. Update environment variables for API URLs

## Technologies Used

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling framework
- **Shadcn/UI**: Component library
- **React Hook Form**: Form handling
- **TanStack Query**: Data fetching (configured for mock data)
- **Wouter**: Lightweight routing
- **Lucide React**: Icons

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

This is a frontend-only demonstration project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the UI functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details