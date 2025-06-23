export interface FluxSource {
    id: string;
    name: string;
    url: string;
    type: "rss" | "api" | "github" | "scientifique";
    theme: string;
    enabled: boolean;
    addedAt: string; // ISO date
  }