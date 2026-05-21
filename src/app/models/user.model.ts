export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  technologies?: string[];
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  githubUrl: string;
  linkedinUrl?: string;
  email: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
}
