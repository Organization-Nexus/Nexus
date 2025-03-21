import { Issue } from "@/types/issue";
import { IssueItem } from "./IssueItem";

interface IssueListProps {
  issues: Issue[];
  currentUserId?: number;
  onSelect: (issueId: number) => void;
}

export function IssueList({ issues, currentUserId, onSelect }: IssueListProps) {
  return (
    <div className="mt-4 space-y-2">
      {issues?.map((issue) => (
        <IssueItem
          key={issue.id}
          issue={issue}
          isAuthor={currentUserId === issue.author.id}
          onSelect={() => onSelect(issue.id)} // IssueItem 클릭 시 해당 이슈 ID 전달
        />
      ))}
      {(!issues || issues.length === 0) && (
        <p className="text-gray-500 text-sm text-center py-4">
          등록된 이슈가 없습니다. 이슈를 등록해보세요 🚀
        </p>
      )}
    </div>
  );
}
