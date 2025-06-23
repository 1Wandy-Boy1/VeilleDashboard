import { PatchInfo } from './category';

export interface Article {
    id: string
    title: string
    source: string
    url: string
    theme: string
    date: string
    tags?: string[]
    summary?: string
    isFavorite?: boolean
    categories?: string[] // IDs des catégories
    patchInfo?: PatchInfo // Informations sur les patches si l'article concerne une vulnérabilité
    severity?: 'low' | 'medium' | 'high' | 'critical' // Niveau de sévérité pour les articles de sécurité
  }
  