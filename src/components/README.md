# Reusable Components

This directory contains reusable UI components that are not tied to specific pages or routes. These components should be:

- Generic and reusable across different parts of the application
- Not dependent on page-specific logic or routing
- Well-documented with TypeScript types and props interfaces
- Styled using Tailwind CSS classes

## Component Categories

- `ui/` - Basic UI components (buttons, inputs, cards, etc.)
- `layout/` - Layout components (containers, grids, etc.)
- `feedback/` - User feedback components (alerts, notifications, etc.)
- `navigation/` - Navigation components (breadcrumbs, pagination, etc.)
- `data-display/` - Components for displaying data (tables, lists, etc.)

## Usage

Import components from this directory when you need reusable UI elements that aren't tied to specific pages or routes. For page-specific components, use the `app/components` directory instead.

Example:
```tsx
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
``` 