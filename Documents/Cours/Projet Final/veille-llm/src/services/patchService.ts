import { PatchInfo } from "@/types/category";

// Sources de patchs avec leurs endpoints
const PATCH_SOURCES = {
  GITHUB: {
    name: "GitHub Security Advisories",
    url: "https://api.github.com/repos/{owner}/{repo}/security-advisories",
    transform: (data: any): PatchInfo[] => {
      return data.map((advisory: any) => ({
        id: advisory.ghsa_id,
        name: advisory.summary,
        description: advisory.description,
        severity: advisory.severity.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        status: 'pending',
        tool: advisory.package.name,
        discoveredAt: advisory.published_at,
        link: advisory.html_url,
        notes: `CVE: ${advisory.cve_id || 'Non assigné'}`
      }));
    }
  },
  NVD: {
    name: "National Vulnerability Database",
    url: "https://services.nvd.nist.gov/rest/json/cves/2.0",
    transform: (data: any): PatchInfo[] => {
      return data.vulnerabilities.map((vuln: any) => ({
        id: vuln.cve.id,
        name: vuln.cve.descriptions[0].value,
        description: vuln.cve.descriptions[0].value,
        severity: vuln.cve.metrics.cvssMetricV31?.[0].cvssData.baseSeverity.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        status: 'pending',
        tool: vuln.cve.configurations[0].nodes[0].cpeMatch[0].criteria,
        discoveredAt: vuln.cve.published,
        link: `https://nvd.nist.gov/vuln/detail/${vuln.cve.id}`,
        notes: `Score CVSS: ${vuln.cve.metrics.cvssMetricV31?.[0].cvssData.baseScore}`
      }));
    }
  }
};

export async function fetchPatchesFromSource(source: keyof typeof PATCH_SOURCES, params?: any): Promise<PatchInfo[]> {
  const sourceConfig = PATCH_SOURCES[source];
  
  try {
    let url = sourceConfig.url;
    
    // Remplace les paramètres dans l'URL si nécessaire
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, value as string);
      });
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des patchs: ${response.statusText}`);
    }

    const data = await response.json();
    return sourceConfig.transform(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération des patchs depuis ${sourceConfig.name}:`, error);
    return [];
  }
}

// Fonction pour récupérer les patchs de React
export async function fetchReactPatches(): Promise<PatchInfo[]> {
  return fetchPatchesFromSource('GITHUB', {
    owner: 'facebook',
    repo: 'react'
  });
}

// Fonction pour récupérer les patchs d'un outil spécifique depuis NVD
export async function fetchPatchesByTool(toolName: string): Promise<PatchInfo[]> {
  return fetchPatchesFromSource('NVD', {
    keywordSearch: toolName
  });
} 