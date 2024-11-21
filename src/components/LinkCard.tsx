import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface LinkCardProps {
  content: string;
  onUpdate: (content: string) => void;
}

export function LinkCard({ content, onUpdate }: LinkCardProps) {
  const [url, setUrl] = useState(content);
  const [isEditing, setIsEditing] = useState(!content);

  const handleSubmit = () => {
    try {
      // Basic URL validation
      new URL(url);
      onUpdate(url);
      setIsEditing(false);
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
          autoFocus
        />
        <Button onClick={handleSubmit} size="sm">Save</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        className="p-3 border rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer group"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-neutral-600 truncate flex-1">{url}</p>
          <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 hover:text-blue-600 hover:underline block truncate"
      >
        Open link
      </a>
    </div>
  );
}