export class MinutesResponseDto {
  id: number;
  title: string;
  meeting_date: Date;
  meeting_time: string;
  agenda: string;
  topic: string;
  content: string;
  decisions: string | null;
  notes: string | null;

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
