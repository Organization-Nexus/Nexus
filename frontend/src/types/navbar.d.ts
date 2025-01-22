export interface NavBarUserInfo {
  name: string;
  mainPosition: string;
  log: {
    profileImage: string;
  };
}

export interface NavBarBtnProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  padding: string;
  isActive?: boolean;
}

export interface LeftNavBarProps {
  projectId: string;
}

export interface RightNavBarProps {
  contents: string[];
}

export interface TopNavBarProps {
  user: {
    name: string;
    log: {
      profileImage: string;
    };
  };
}
