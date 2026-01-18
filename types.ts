
export enum Priority {
  LOW = 'baixa',
  MEDIUM = 'media',
  HIGH = 'alta'
}

export enum TaskStatus {
  TODO = 'pendente',
  IN_PROGRESS = 'em_andamento',
  DONE = 'concluida'
}

export enum TaskCategory {
  WORK = 'TRABALHO',
  PERSONAL = 'PESSOAL',
  STUDY = 'ESTUDOS',
  HEALTH = 'SAÚDE',
  URGENT = 'URGENTE'
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  due_date: string;
  created_at: string;
  completed_at?: string | null;
}

export type Note = {
  id: string;
  user_id?: string;
  content: string;
  pinned: boolean;
  linked_task_id?: string | null;
  created_at: string;
  updated_at?: string;
};

export interface UserSettings {
  user_id: string;
  pomodoro_focus: number;
  pomodoro_break: number;
  long_break: number;
  dark_mode: boolean;
  notifications: boolean;
}
