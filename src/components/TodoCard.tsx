import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TodoItem } from '@/lib/store';
import { nanoid } from 'nanoid';

interface TodoCardProps {
  items: TodoItem[];
  onUpdate: (items: TodoItem[]) => void;
}

export function TodoCard({ items, onUpdate }: TodoCardProps) {
  const [newItemText, setNewItemText] = useState('');

  const addItem = () => {
    if (newItemText.trim()) {
      onUpdate([
        ...items,
        { id: nanoid(), text: newItemText.trim(), completed: false },
      ]);
      setNewItemText('');
    }
  };

  const toggleItem = (id: string) => {
    onUpdate(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    onUpdate(items.filter((item) => item.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new task..."
          className="flex-1"
        />
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 group"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex-shrink-0"
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-neutral-300" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                item.completed ? 'line-through text-neutral-400' : ''
              }`}
            >
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-sm text-neutral-400 text-center py-2">
          No tasks yet. Add one above!
        </p>
      )}
    </div>
  );
}