import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageData } from '@/lib/store';

interface ImageCardProps {
  content: string;
  imageData?: ImageData;
  onUpdate: (updates: { content: string; imageData?: ImageData }) => void;
}

export function ImageCard({ content, imageData, onUpdate }: ImageCardProps) {
  const [isAddingUrl, setIsAddingUrl] = useState(!imageData);
  const [url, setUrl] = useState(content);
  const [description, setDescription] = useState(imageData?.description || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onUpdate({
          content: dataUrl,
          imageData: {
            url: dataUrl,
            type: 'upload',
            description
          }
        });
        setIsAddingUrl(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) return;

    // Basic URL validation
    try {
      new URL(url);
      onUpdate({
        content: url,
        imageData: {
          url,
          type: 'external',
          description
        }
      });
      setIsAddingUrl(false);
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    if (imageData) {
      onUpdate({
        content: imageData.url,
        imageData: { ...imageData, description: newDescription }
      });
    }
  };

  if (isAddingUrl) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter image URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleUrlSubmit} size="sm">Add</Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-500">or</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-neutral-400" />
          <span className="text-sm text-neutral-600">Upload from your device</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {imageData ? (
        <>
          <div className="relative group">
            <img
              src={imageData.url}
              alt={description || 'Card content'}
              className="w-full h-auto rounded-lg"
              onError={() => setIsAddingUrl(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingUrl(true)}
              >
                Change Image
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Add image description..."
            value={description}
            onChange={handleDescriptionChange}
            className="w-full resize-none text-sm"
            rows={2}
          />
        </>
      ) : (
        <div
          className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors"
          onClick={() => setIsAddingUrl(true)}
        >
          <ImageIcon className="w-8 h-8 text-neutral-400" />
        </div>
      )}
    </div>
  );
}