// 커스텀 React 훅을 관리
// 공통 상태나 비즈니스 로직을 캡슐화
import { useState, useEffect } from "react";

export function useUser(userId: string) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);

  return user;
}
