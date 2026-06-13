import { useQuery } from "@tanstack/react-query";

export interface GitHubRelease {
  tag_name: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
  html_url: string;
}

export function useGithubRelease() {
  return useQuery({
    queryKey: ["github-release"],
    queryFn: async (): Promise<GitHubRelease> => {
      const response = await fetch(
        "https://api.github.com/repos/nhut0902-pr/SEVER-MINI-APP-BOT/releases/latest",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub release");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
