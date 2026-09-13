import { describe, it, expect } from 'vitest';
import { calculateProgress, isOverdue } from '../src/lib/utils/progress';

describe('Progress Calculation Logic', () => {
  it('returns 0% when there are 0 tasks', () => {
    const result = calculateProgress([]);
    expect(result).toEqual({
      total: 0,
      completed: 0,
      remaining: 0,
      progress: 0,
    });
  });

  it('calculates 60% progress for 6 done out of 10 tasks (PRD example)', () => {
    const tasks = [
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'TODO' },
      { status: 'TODO' },
      { status: 'IN_PROGRESS' },
      { status: 'IN_PROGRESS' },
    ];
    const result = calculateProgress(tasks);
    expect(result.total).toBe(10);
    expect(result.completed).toBe(6);
    expect(result.remaining).toBe(4);
    expect(result.progress).toBe(60);
  });

  it('calculates 100% progress when all tasks are done', () => {
    const tasks = [{ status: 'DONE' }, { status: 'DONE' }];
    const result = calculateProgress(tasks);
    expect(result.progress).toBe(100);
    expect(result.remaining).toBe(0);
  });

  it('rounds progress to nearest integer correctly', () => {
    const tasks = [{ status: 'DONE' }, { status: 'TODO' }, { status: 'TODO' }]; // 1/3 = 33.33% -> 33%
    const result = calculateProgress(tasks);
    expect(result.progress).toBe(33);
  });
});

describe('Overdue Helper', () => {
  it('identifies overdue past dates for incomplete tasks', () => {
    const pastDate = new Date(Date.now() - 86400000 * 2).toISOString();
    expect(isOverdue(pastDate, 'TODO')).toBe(true);
    expect(isOverdue(pastDate, 'IN_PROGRESS')).toBe(true);
  });

  it('does not mark completed tasks as overdue', () => {
    const pastDate = new Date(Date.now() - 86400000 * 2).toISOString();
    expect(isOverdue(pastDate, 'DONE')).toBe(false);
  });

  it('does not mark future dates as overdue', () => {
    const futureDate = new Date(Date.now() + 86400000 * 5).toISOString();
    expect(isOverdue(futureDate, 'TODO')).toBe(false);
  });
});
