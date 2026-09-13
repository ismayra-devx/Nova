import { describe, it, expect } from 'vitest';
import {
  signUpSchema,
  createProjectSchema,
  createTaskSchema,
  addMemberSchema,
} from '../src/lib/validations';

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
    it('accepts valid signup inputs', () => {
      const valid = {
        name: 'Alex Johnson',
        email: 'alex@nova.team',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = signUpSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects non-matching passwords', () => {
      const invalid = {
        name: 'Alex Johnson',
        email: 'alex@nova.team',
        password: 'password123',
        confirmPassword: 'password456',
      };
      const result = signUpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects short passwords', () => {
      const invalid = {
        name: 'Alex',
        email: 'alex@nova.team',
        password: '123',
        confirmPassword: '123',
      };
      const result = signUpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createProjectSchema', () => {
    it('requires project name and trims whitespace', () => {
      const invalid = { name: '   ', description: 'Test' };
      const result = createProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('accepts valid project without description', () => {
      const valid = { name: 'Apollo Project' };
      const result = createProjectSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('createTaskSchema', () => {
    it('accepts valid task with status and priority', () => {
      const valid = {
        title: 'Implement login',
        status: 'TODO',
        priority: 'MEDIUM',
      };
      const result = createTaskSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('TODO');
        expect(result.data.priority).toBe('MEDIUM');
      }
    });

    it('rejects invalid status value', () => {
      const invalid = {
        title: 'Task',
        status: 'INVALID_STATUS',
        priority: 'MEDIUM',
      };
      const result = createTaskSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects empty title', () => {
      const invalid = { title: '', status: 'TODO', priority: 'MEDIUM' };
      const result = createTaskSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addMemberSchema', () => {
    it('validates email format', () => {
      expect(addMemberSchema.safeParse({ email: 'invalid-email' }).success).toBe(false);
      expect(addMemberSchema.safeParse({ email: 'valid@nova.team' }).success).toBe(true);
    });
  });
});
