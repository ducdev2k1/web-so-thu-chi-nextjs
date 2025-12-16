# **App Name**: FinanceFlow

## Core Features:

- Income/Expense Tracking: Record income and expenses, categorize them with tags, and associate icons.
- Calendar View: Display transactions on a calendar with day, week, month, and year views.
- Transaction Details: Clicking a day in the calendar reveals transaction details for that day below the calendar.
- Data Export: Export financial data to Excel, CSV, and PDF formats for external use.
- Tag Management: Create and manage tags for categorizing transactions. Select a representative icon for each.
- Interactive Charts: Visualize financial data through charts and graphs in a dedicated statistics page.
- Theme Switching: Automatically toggle between light and dark theme based on system settings; manual override available.

## Style Guidelines:

- Primary color: A subdued green (#90EE90) to create a calm and trustworthy feeling.
- Background color: Light beige (#F5F5DC). This creates a neutral but slightly warm canvas. The hue is very similar to the primary color, but much lighter.
- Accent color: Light blue (#ADD8E6) to complement the primary green. Contrast against both light beige and green is provided via lightness, but the combination of blue and green feels natural.
- Body and headline font: 'PT Sans' a humanist sans-serif font combining a modern look with warmth. Note: currently only Google Fonts are supported.
- Use minimalist line icons to represent transaction categories. Consider a uniform stroke weight and consistent style across all icons.
- Apply the BEM (Block, Element, Modifier) naming convention with prefixes 'p-' for pages, 'c-' for components, and 'l-' for layouts.  Example: p-home, p-home_banner
- Use subtle transitions when switching between calendar views and loading transaction details to enhance user experience.