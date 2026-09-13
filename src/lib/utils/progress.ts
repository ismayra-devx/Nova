export interface TaskProgressSummary {
  total: number;
  completed: number;
  remaining: number;
  progress: number;
}

/**
 * Calculates project progress and task counts
 * Formula: (completed / total) * 100
 * If total is 0, progress is 0%
 * Rounds to an integer percentage
 */
export function calculateProgress(tasks: Array<{ status: string }> = []): TaskProgressSummary {
  const total = tasks.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      remaining: 0,
      progress: 0,
    };
  }

  const completed = tasks.filter((t) => t.status === 'DONE').length;
  const remaining = total - completed;
  const progress = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    remaining,
    progress,
  };
}

/**
 * Formats a date string into readable short date
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'No due date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Checks if a task due date is overdue (and not done)
 */
export function isOverdue(dueDate: string | null | undefined, status: string): boolean {
  if (!dueDate || status === 'DONE') return false;
  try {
    const due = new Date(dueDate);
    const today = new Date();
    // Normalize to start of day for fair comparison
    today.setHours(0, 0, 0, 0);
    return due < today;
  } catch {
    return false;
  }
}
