import { PatchInfo } from "@/types/category";
import Parser from 'rss-parser';

// Configuration des sources
const SOURCES = {
  NODEJS: {
    name: "Node.js Security",
    url: "https://nodejs.org/en/security/",
    type: "rss",
    parser: (data: any): PatchInfo[] => {
      // Parser le flux RSS de Node.js
      return data.items.map((item: any) => ({
        id: `nodejs-${item.guid}`,
        name: item.title,
        description: item.description,
        severity: item.categories?.includes('critical') ? 'critical' : 
                 item.categories?.includes('high') ? 'high' :
                 item.categories?.includes('medium') ? 'medium' : 'low',
        status: 'pending',
        tool: 'Node.js',
        discoveredAt: item.pubDate,
        link: item.link,
        notes: `Version affectée: ${item.categories?.find((c: string) => c.startsWith('v')) || 'Non spécifiée'}`
      }));
    }
  },
  PYTHON: {
    name: "Python Security",
    url: "https://www.python.org/news/security/",
    type: "html",
    parser: (data: any): PatchInfo[] => {
      // Parser la page HTML de Python
      return data.map((item: any) => ({
        id: `python-${item.id}`,
        name: item.title,
        description: item.description,
        severity: item.severity || 'medium',
        status: 'pending',
        tool: 'Python',
        discoveredAt: item.date,
        link: item.url,
        notes: `Version Python: ${item.version || 'Non spécifiée'}`
      }));
    }
  },
  MSRC: {
    name: "Microsoft Security Response Center",
    url: "https://api.msrc.microsoft.com/cvrf/v2.0/updates",
    type: "api",
    parser: (data: any): PatchInfo[] => {
      // Parser la réponse de l'API MSRC
      return data.value.map((item: any) => ({
        id: `msrc-${item.ID}`,
        name: item.Title,
        description: item.Description,
        severity: item.Severity.toLowerCase(),
        status: 'pending',
        tool: item.Product,
        discoveredAt: item.InitialReleaseDate,
        link: item.URL,
        notes: `KB: ${item.KBID || 'Non spécifié'}`
      }));
    }
  },
  NVD: {
    name: "National Vulnerability Database",
    url: "https://services.nvd.nist.gov/rest/json/cves/2.0",
    type: "api",
    parser: (data: any): PatchInfo[] => {
      return data.vulnerabilities.map((vuln: any) => ({
        id: vuln.cve.id,
        name: vuln.cve.descriptions[0].value,
        description: vuln.cve.descriptions[0].value,
        severity: vuln.cve.metrics.cvssMetricV31?.[0].cvssData.baseSeverity.toLowerCase(),
        status: 'pending',
        tool: vuln.cve.configurations[0].nodes[0].cpeMatch[0].criteria,
        discoveredAt: vuln.cve.published,
        link: `https://nvd.nist.gov/vuln/detail/${vuln.cve.id}`,
        notes: `Score CVSS: ${vuln.cve.metrics.cvssMetricV31?.[0].cvssData.baseScore}`
      }));
    }
  },
  GITHUB: {
    name: "GitHub Security Advisories",
    url: "https://api.github.com/repos/{owner}/{repo}/security-advisories",
    type: "api",
    parser: (data: any): PatchInfo[] => {
      return data.map((advisory: any) => ({
        id: advisory.ghsa_id,
        name: advisory.summary,
        description: advisory.description,
        severity: advisory.severity.toLowerCase(),
        status: 'pending',
        tool: advisory.package.name,
        discoveredAt: advisory.published_at,
        link: advisory.html_url,
        notes: `CVE: ${advisory.cve_id || 'Non assigné'}`
      }));
    }
  }
};

interface PatchSource {
  url: string;
  type: 'rss' | 'html' | 'api' | 'graphql';
  format?: 'json' | 'markdown' | 'xml';
  parser?: (data: any) => PatchInfo[];
}

export async function fetchPatchesFromSource(source: PatchSource): Promise<PatchInfo[]> {
  try {
    let response;
    let data;

    switch (source.type) {
      case 'rss':
        // Utiliser un proxy CORS plus fiable
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const rssUrl = `${corsProxy}${encodeURIComponent(source.url)}`;
        
        try {
          response = await fetch(rssUrl);
          const xmlText = await response.text();
          
          // Parser le XML manuellement
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const items = xmlDoc.querySelectorAll("item");
          
          return Array.from(items).map(item => {
            const title = item.querySelector("title")?.textContent || "";
            const description = item.querySelector("description")?.textContent || "";
            const link = item.querySelector("link")?.textContent || "";
            const pubDate = item.querySelector("pubDate")?.textContent || "";
            const guid = item.querySelector("guid")?.textContent || "";
            
            return {
              id: guid || link || Date.now().toString(),
              name: title || 'Sans titre',
              description: description || '',
              severity: determineSeverity(title),
              status: 'pending',
              tool: extractToolFromUrl(source.url),
              discoveredAt: pubDate || new Date().toISOString(),
              link: link || '',
              source: {
                url: source.url,
                type: 'rss'
              }
            };
          });
        } catch (error) {
          console.error('Erreur lors du parsing RSS:', error);
          return [];
        }
      
      case 'html':
        response = await fetch(source.url);
        data = await response.text();
        return parseHTML(data, source);
      
      case 'api':
        response = await fetch(source.url);
        data = await response.json();
        return source.parser ? source.parser(data) : parseAPI(data, source);
      
      case 'graphql':
        response = await fetch(source.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                securityAdvisories(first: 100) {
                  nodes {
                    ghsaId
                    summary
                    description
                    severity
                    publishedAt
                    updatedAt
                    vulnerabilities(first: 10) {
                      nodes {
                        package {
                          name
                        }
                      }
                    }
                  }
                }
              }
            `
          })
        });
        data = await response.json();
        return source.parser ? source.parser(data) : parseGraphQL(data, source);
      
      default:
        throw new Error(`Type de source non supporté: ${source.type}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des patchs depuis ${source.url}:`, error);
    return [];
  }
}

// Fonction pour déterminer la sévérité basée sur le titre
function determineSeverity(title: string): 'low' | 'medium' | 'high' | 'critical' {
  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes('critical') || lowercaseTitle.includes('critique')) {
    return 'critical';
  } else if (lowercaseTitle.includes('high') || lowercaseTitle.includes('importante')) {
    return 'high';
  } else if (lowercaseTitle.includes('medium') || lowercaseTitle.includes('modérée')) {
    return 'medium';
  }
  return 'low';
}

// Fonction pour extraire le nom de l'outil depuis l'URL
function extractToolFromUrl(url: string): string {
  if (url.includes('postgresql.org')) return 'PostgreSQL';
  if (url.includes('python.org')) return 'Python';
  if (url.includes('nodejs.org')) return 'Node.js';
  if (url.includes('github.com')) return 'GitHub';
  if (url.includes('msrc.microsoft.com')) return 'Microsoft';
  if (url.includes('nvd.nist.gov')) return 'NVD';
  return 'Unknown';
}

function parseHTML(data: string, source: PatchSource): PatchInfo[] {
  // Implémentation du parsing HTML
  return [];
}

function parseAPI(data: any, source: PatchSource): PatchInfo[] {
  // Implémentation du parsing API
  return [];
}

function parseGraphQL(data: any, source: PatchSource): PatchInfo[] {
  // Implémentation du parsing GraphQL
  return [];
}

// Fonctions spécifiques pour chaque source
export async function fetchNodeJSPatches(): Promise<PatchInfo[]> {
  return fetchPatchesFromSource(SOURCES.NODEJS);
}

export async function fetchPythonPatches(): Promise<PatchInfo[]> {
  return fetchPatchesFromSource(SOURCES.PYTHON);
}

export async function fetchMSRCPatches(): Promise<PatchInfo[]> {
  return fetchPatchesFromSource(SOURCES.MSRC);
}

export async function fetchNVDPatches(product?: string): Promise<PatchInfo[]> {
  return fetchPatchesFromSource(SOURCES.NVD);
}

export async function fetchGitHubPatches(owner: string, repo: string): Promise<PatchInfo[]> {
  return fetchPatchesFromSource(SOURCES.GITHUB);
} 