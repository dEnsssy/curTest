import { DragEvent } from 'react';
import { ColumnConfig, Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  draggedTask: Task | null;
  onAdd: (status: TaskStatus) => void;
  onDelete: (id: number) => void;
  onUpdate: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDrop: (status: TaskStatus) => void;
}

export default function KanbanColumn({
  column,
  tasks,
  draggedTask,
  onAdd,
  onDelete,
  onUpdate,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    if (draggedTask) onDrop(column.id);
  }

  return (
    <section
      className={`kanban-column kanban-column--${column.id}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label={column.title}
    >
      <header className="kanban-column__header">
        <div className="kanban-column__title-wrap">
          <span className="column-icon" aria-hidden="true">
            {column.icon}
          </span>
          <h2>{column.title}</h2>
        </div>
        <button className="add-task-button" onClick={() => onAdd(column.id)}>
          + Добавить
        </button>
      </header>

      <div className="kanban-column__body">
        {tasks.length === 0 ? (
          <div className="empty-column">Нет задач</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </section>
  );
}
