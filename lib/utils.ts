import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a numeric string or number into a CAD currency string.
 * @param amount - The amount to format (string or number).
 * @returns The formatted currency string (e.g., "$1,234.56") or the original value if invalid.
 */
export function formatCurrency(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "$0.00"; // Or return placeholder like '-'
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    // Handle cases where parsing failed - return a default or placeholder
    console.warn(`Could not parse amount for currency formatting: ${amount}`);
    return "$ --.--"; // Or return the original input if preferred
  }

  // Use 'en-CA' for Canadian locale formatting
  // Use 'CAD' for Canadian Dollar symbol and formatting rules
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(numericAmount);
}
