import { useState } from 'react';
import { Task } from '../types';
import {
  dateInputToTimestamp,
  formatDate,
  isOverdue,
  timestampToInputValue,
} from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (updatedTask: Task) => void;
  onDragStart: (task: Task) => void;
}

export default function TaskCard({
  task,
  onDelete,
  onUpdate,
  onDragStart,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [startDay, setStartDay] = useState(
    timestampToInputValue(task.startDay),
  );
  const [endDay, setEndDay] = useState(timestampToInputValue(task.endDay));
  const overdue = isOverdue(task);

  function saveChanges() {
    if (!text.trim() || !startDay || !endDay) return;
    onUpdate({
      ...task,
      text: text.trim(),
      startDay: dateInputToTimestamp(startDay),
      endDay: dateInputToTimestamp(endDay),
    });
    setIsEditing(false);
  }

  function cancelEditing() {
    setText(task.text);
    setStartDay(timestampToInputValue(task.startDay));
    setEndDay(timestampToInputValue(task.endDay));
    setIsEditing(false);
  }

  return (
    <article
      className={`task-card${overdue ? ' task-card--overdue' : ''}`}
      draggable={!isEditing}
      onDragStart={() => onDragStart(task)}
    >
      {isEditing ? (
        <div className="task-editor">
          <label>
            Начало
            <input
              type="date"
              value={startDay}
              onChange={(event) => setStartDay(event.target.value)}
            />
          </label>
          <label>
            Окончание
            <input
              type="date"
              value={endDay}
              onChange={(event) => setEndDay(event.target.value)}
            />
          </label>
          <label>
            Описание
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
            />
          </label>
          <div className="task-editor__actions">
            <button
              className="editor-button editor-button--save"
              onClick={saveChanges}
              aria-label="Сохранить"
            >
              ✓
            </button>
            <button
              className="editor-button"
              onClick={cancelEditing}
              aria-label="Отменить"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-card__actions">
            <button
              className="icon-button"
              aria-label="Редактировать"
              title="Редактировать"
              onClick={() => setIsEditing(true)}
            >
              ✎
            </button>
            <button
              className="icon-button icon-button--delete"
              aria-label="Удалить"
              title="Удалить"
              onClick={() => onDelete(task.id)}
            >
              ×
            </button>
          </div>
          <div className="task-card__row">
            <span>Начало:</span>
            <strong>{formatDate(task.startDay)}</strong>
          </div>
          <div
            className={`task-card__row${overdue ? ' task-card__row--overdue' : ''}`}
          >
            <span>Окончание:</span>
            <strong>{formatDate(task.endDay)}</strong>
          </div>
          <div className="task-card__row task-card__description">
            <span>Описание:</span>
            <strong>{task.text}</strong>
          </div>
        </>
      )}
    </article>
  );
}
