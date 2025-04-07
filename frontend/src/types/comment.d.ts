export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface CreateFeedCommentRequest extends CreateCommentRequest {
  feedId: number;
}

export interface CreateVoteCommentRequest extends CreateCommentRequest {
  voteId: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  projectUser: ProjectUser;
  replies: CommentResponse[];
}

export interface ProjectUser {
  id: number;
  position: string;
  name: string;
  profileImage: string;
}
