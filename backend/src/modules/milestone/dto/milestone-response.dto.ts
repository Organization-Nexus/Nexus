export class MilestoneResponseDto {
  id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  content: string;
  goal: string;
  note: string | null;
  category: string;
  author: {
    id: number;
    user: {
      name: string;
      position: string;
      log: {
        profileImage: string;
      };
    };
  };

  participants: Array<{
    id: number;
    member: {
      id: number;
      user: {
        name: string;
        log: {
          profileImage: string;
        };
      };
    };
  }>;
}
