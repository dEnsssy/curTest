import { useEffect, useMemo, useState } from 'react';
import initialTasks from './data/tasks.json';
import KanbanColumn from './components/KanbanColumn';
import { ColumnConfig, Task, TaskStatus } from './types';
import { matchesSearch, sortTasks } from './utils/taskUtils';

const STORAGE_KEY = 'kanban-board-tasks';
const initialTaskList = initialTasks as unknown as Task[];

const columns: ColumnConfig[] = [
  { id: 'todo', title: 'To Do', icon: '☻' },
  { id: 'in_progress', title: 'In Progress', icon: '☻' },
  { id: 'review', title: 'Review', icon: '☻' },
  { id: 'done', title: 'Done', icon: '▣' },
];

function loadTasks(): Task[] {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks !== null) {
      const parsed = JSON.parse(savedTasks) as Task[];
      return Array.isArray(parsed) ? parsed : initialTaskList;
    }
  } catch (error) {
    console.error('Не удалось прочитать задачи из LocalStorage:', error);
  }
  return initialTaskList;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [search, setSearch] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const visibleTasks = useMemo(
    () => sortTasks(tasks.filter((task) => matchesSearch(task, search))),
    [tasks, search],
  );

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function updateTask(updatedTask: Task) {
    setTasks((current) => current.map((task) => task.id === updatedTask.id ? updatedTask : task));
  }

  function addTask(status: TaskStatus) {
    const text = window.prompt('Введите описание задачи:');
    if (!text?.trim()) return;

    const today = new Date();
    const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).getTime();
    const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

    setTasks((current) => [...current, { id, type: status, startDay, endDay: end, text: text.trim() }]);
  }

  function moveDraggedTask(status: TaskStatus) {
    if (!draggedTask) return;
    setTasks((current) => current.map((task) =>
      task.id === draggedTask.id ? { ...task, type: status } : task,
    ));
    setDraggedTask(null);
  }

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="page-header">
          <h1>Your tasks</h1>
          <div className="search-field">
            <span className="search-field__icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Поиск..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Поиск по задачам и датам"
            />
            {search && <button className="search-field__clear" onClick={() => setSearch('')} aria-label="Очистить поиск">×</button>}
          </div>
        </header>

        <section className="board" aria-label="Канбан-доска">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={visibleTasks.filter((task) => task.type === column.id)}
              draggedTask={draggedTask}
              onAdd={addTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onDragStart={setDraggedTask}
              onDrop={moveDraggedTask}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
