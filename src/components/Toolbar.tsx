import { Plus, FileText, Image, Link2, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoard, CardType } from '@/lib/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Toolbar() {
  const { addCard } = useBoard();

  const handleAddCard = (type: CardType) => {
    const position = {
      x: Math.random() * (window.innerWidth - 300),
      y: 100 + Math.random() * (window.innerHeight - 300),
    };
    addCard(type, position);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 flex gap-2">
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Card
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Create a new card</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={() => handleAddCard('text')} className="gap-2">
              <FileText className="w-4 h-4" />
              Text Note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddCard('image')} className="gap-2">
              <Image className="w-4 h-4" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddCard('link')} className="gap-2">
              <Link2 className="w-4 h-4" />
              Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddCard('todo')} className="gap-2">
              <ListTodo className="w-4 h-4" />
              Todo List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );
}