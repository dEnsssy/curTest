export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: number;
  type: TaskStatus;
  startDay: number;
  endDay: number;
  text: string;
}

export interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: string;
}
