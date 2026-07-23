export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  updated_at: string;
  language: string | null;
  topics: string[];
}
