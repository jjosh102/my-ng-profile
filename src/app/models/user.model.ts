export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  githubUrl: string;
  email: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
}
