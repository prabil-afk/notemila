import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { Card } from './Card';
import { Toolbar } from './Toolbar';
import { useBoard } from '@/lib/store';

export function Board() {
  const { cards, updateCardPosition } = useBoard();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const card = cards.find((c) => c.id === active.id);
    
    if (card) {
      updateCardPosition(card.id, {
        x: card.position.x + delta.x,
        y: card.position.y + delta.y,
      });
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-neutral-200/50 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <Toolbar />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="w-full h-full p-4">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
          {cards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-neutral-400 text-lg">
                Click "Add Card" to get started
              </p>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}