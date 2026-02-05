'use client';

import { useState } from 'react';

interface CreateThreadFormProps {
  onCreate: (thread: {
    name: string;
    description: string;
    task: string;
    criticalPath?: string;
    todo: string[];
  }) => void;
}

export function CreateThreadForm({ onCreate }: CreateThreadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [task, setTask] = useState('');
  const [criticalPath, setCriticalPath] = useState('');
  const [todoInput, setTodoInput] = useState('');
  const [todos, setTodos] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      task,
      criticalPath: criticalPath || undefined,
      todo: todos
    });
    
    // Reset form
    setName('');
    setDescription('');
    setTask('');
    setCriticalPath('');
    setTodos([]);
    setTodoInput('');
    setIsOpen(false);
  };

  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos([...todos, todoInput.trim()]);
      setTodoInput('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + New Thread
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Create New Thread</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What are you working on?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief context..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currently Working On *
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What are you doing right now?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Critical Path
          </label>
          <input
            type="text"
            value={criticalPath}
            onChange={(e) => setCriticalPath(e.target.value)}
            placeholder="The ONE thing that moves this forward (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Steps
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTodo())}
              placeholder="Add a next step..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addTodo}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          
          {todos.length > 0 && (
            <ul className="space-y-1">
              {todos.map((todo, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span>→</span>
                  <span>{todo}</span>
                  <button
                    type="button"
                    onClick={() => setTodos(todos.filter((_, idx) => idx !== i))}
                    className="text-red-500 hover:text-red-700 ml-auto"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Create Thread
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
