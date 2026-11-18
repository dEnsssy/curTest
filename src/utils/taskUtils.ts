import { Task } from '../types';

export function timestampToDate(timestamp: number): Date {
  const milliseconds = Math.abs(timestamp) < 1_000_000_000_000
    ? timestamp * 1000
    : timestamp;

  return new Date(milliseconds);
}

export function timestampToInputValue(timestamp: number): string {
  const date = timestampToDate(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDate(timestamp: number): string {
  const date = timestampToDate(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function dateInputToTimestamp(value: string): number {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.type === 'done') return false;

  const endDate = timestampToDate(task.endDay);
  const endOfTaskDay = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return endOfTaskDay.getTime() < today.getTime();
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (first, second) =>
      timestampToDate(first.startDay).getTime() -
      timestampToDate(second.startDay).getTime(),
  );
}

export function matchesSearch(task: Task, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const textMatches = task.text.toLowerCase().includes(normalizedQuery);
  const isDateQuery = /^\d{2}\.\d{2}\.\d{4}$/.test(normalizedQuery);

  if (isDateQuery) {
    return formatDate(task.startDay) === normalizedQuery || formatDate(task.endDay) === normalizedQuery;
  }

  return textMatches;
}
