import { formatDistanceToNow, parseISO, format } from 'date-fns';

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount?: number, currency: string = 'GHS'): string {
  if (amount === undefined || amount === null) return '—';
  
  const symbolMap: Record<string, string> = {
    GHS: 'GH₵',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };

  const symbol = symbolMap[currency] || currency;

  return `${symbol} ${amount.toLocaleString('en-US')}`;
}

export function formatCompactNumber(number: number): string {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  }
  return number.toString();
}

export function truncateText(text: string, maxLength: number = 120): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
