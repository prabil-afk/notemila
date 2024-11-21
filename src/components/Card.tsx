import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType, useBoard } from '@/lib/store';
import { cn } from '@/lib/utils';
import { FileText, Image, Link2, X, ListTodo } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageCard } from './ImageCard';
import { TodoCard } from './TodoCard';
import { LinkCard } from './LinkCard';

const icons = {
  text: FileText,
  image: Image,
  link: Link2,
  todo: ListTodo,
};

export function Card({ id, type, content, position, imageData, todoItems = [] }: CardType) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      type: 'card',
    }
  });
  const { updateCard, deleteCard } = useBoard();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(type);
  const Icon = icons[type];

  const style = {
    transform: CSS.Transform.toString(transform),
    left: position.x,
    top: position.y,
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCard(id, { content: e.target.value });
    adjustTextareaHeight();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <TooltipProvider>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'absolute w-64 bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl',
          transform ? 'z-50' : 'z-0'
        )}
      >
        <div 
          className="p-3 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-t-lg cursor-move"
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center gap-2 flex-1">
            <Icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-sm font-medium text-neutral-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 w-full"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:text-red-500 flex-shrink-0"
                onClick={() => deleteCard(id)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete card</TooltipContent>
          </Tooltip>
        </div>
        <div 
          className="p-4 rounded-b-lg"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {type === 'text' ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextChange}
              className="w-full min-h-[3rem] resize-none border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your text here..."
              rows={1}
            />
          ) : type === 'image' ? (
            <ImageCard
              content={content}
              imageData={imageData}
              onUpdate={(updates) => updateCard(id, updates)}
            />
          ) : type === 'todo' ? (
            <TodoCard
              items={todoItems}
              onUpdate={(items) => updateCard(id, { todoItems: items })}
            />
          ) : type === 'link' ? (
            <LinkCard
              content={content}
              onUpdate={(content) => updateCard(id, { content })}
            />
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  );
}