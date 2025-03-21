import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CommentForm({
  onSubmit,
  placeholder = "댓글을 입력하세요...",
}: {
  onSubmit: (content: string) => void;
  placeholder?: string;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-2">
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" disabled={!content.trim()}>
        작성
      </Button>
    </form>
  );
}
