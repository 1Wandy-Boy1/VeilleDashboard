'use client';

import { useState, useEffect } from 'react';
import { PatchInfo } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Plus, Trash2, Edit, Save, X, Filter, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchPatchesFromSource } from "@/services/patchSources";

interface CustomSource {
  url: string;
  type: 'rss' | 'html' | 'api' | 'graphql';
  format?: 'json' | 'markdown' | 'xml';
  name: string;
}

export default function PatchesPage() {
  const [patches, setPatches] = useState<PatchInfo[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<PatchInfo[]>([]);
  const [newPatch, setNewPatch] = useState<Partial<PatchInfo>>({
    status: 'pending',
    severity: 'medium'
  });
  const [editingPatch, setEditingPatch] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    severity: 'all',
    status: 'all',
    tool: ''
  });
  const [sources, setSources] = useState<CustomSource[]>([]);
  const [newSource, setNewSource] = useState<Partial<CustomSource>>({});

  // Charger les patchs depuis le localStorage au démarrage
  useEffect(() => {
    const savedPatches = localStorage.getItem('patches');
    if (savedPatches) {
      setPatches(JSON.parse(savedPatches));
    }
  }, []);

  // Sauvegarder les patchs dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('patches', JSON.stringify(patches));
    filterPatches();
  }, [patches, filter]);

  // Charger les sources depuis le localStorage
  useEffect(() => {
    const savedSources = localStorage.getItem('patchSources');
    if (savedSources) {
      setSources(JSON.parse(savedSources));
    }
  }, []);

  // Sauvegarder les sources dans le localStorage
  useEffect(() => {
    localStorage.setItem('patchSources', JSON.stringify(sources));
  }, [sources]);

  // Filtrer les patchs
  const filterPatches = () => {
    let filtered = [...patches];
    if (filter.severity && filter.severity !== 'all') {
      filtered = filtered.filter(p => p.severity === filter.severity);
    }
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter(p => p.status === filter.status);
    }
    if (filter.tool) {
      filtered = filtered.filter(p => p.tool.toLowerCase().includes(filter.tool.toLowerCase()));
    }
    setFilteredPatches(filtered);
  };

  const addPatch = () => {
    if (newPatch.name && newPatch.description && newPatch.tool) {
      const patch: PatchInfo = {
        id: Date.now().toString(),
        name: newPatch.name,
        description: newPatch.description,
        severity: newPatch.severity || 'medium',
        status: newPatch.status || 'pending',
        tool: newPatch.tool,
        discoveredAt: new Date().toISOString(),
        link: newPatch.link || 'https://example.com',
        notes: newPatch.notes || '',
        source: {
          url: 'manual',
          type: 'api'
        }
      };
      setPatches([...patches, patch]);
      setNewPatch({ status: 'pending', severity: 'medium' });
    }
  };

  const updatePatch = (id: string, updatedPatch: Partial<PatchInfo>) => {
    setPatches(patches.map(patch => 
      patch.id === id ? { ...patch, ...updatedPatch } : patch
    ));
    setEditingPatch(null);
  };

  const deletePatch = (id: string) => {
    setPatches(patches.filter(patch => patch.id !== id));
  };

  const addSource = () => {
    if (newSource.url && newSource.type && newSource.name) {
      setSources([...sources, newSource as CustomSource]);
      setNewSource({});
    }
  };

  const removeSource = (url: string) => {
    setSources(sources.filter(source => source.url !== url));
  };

  const fetchPatches = async (source: CustomSource) => {
    setIsLoading(true);
    try {
      const newPatches = await fetchPatchesFromSource({
        url: source.url,
        type: source.type,
        format: source.format
      });
      setPatches(prevPatches => {
        const uniquePatches = newPatches.filter(newPatch => 
          !prevPatches.some(existingPatch => existingPatch.id === newPatch.id)
        );
        return [...prevPatches, ...uniquePatches];
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération des patchs depuis ${source.url}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Suivi des Patchs de Sécurité</h1>
      </div>

      {/* Formulaire d'ajout de source */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ajouter une source de patchs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Nom de la source"
              value={newSource.name || ''}
              onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
            />
            <Input
              placeholder="URL de la source"
              value={newSource.url || ''}
              onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
            />
            <Select
              value={newSource.type || ''}
              onValueChange={(value) => setNewSource({ ...newSource, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rss">RSS</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="graphql">GraphQL</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addSource} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter la source
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sources */}
      <div className="grid gap-4 mb-8">
        {sources.map(source => (
          <Card key={source.url}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{source.name}</h3>
                  <p className="text-sm text-gray-500">{source.url}</p>
                  <p className="text-sm text-gray-500">Type: {source.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchPatches(source)}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Chargement...' : 'Récupérer les patchs'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeSource(source.url)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Select
          value={filter.severity}
          onValueChange={(value) => setFilter({ ...filter, severity: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par gravité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les gravités</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Élevée</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.status}
          onValueChange={(value) => setFilter({ ...filter, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="applied">Appliqué</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="not_applicable">Non applicable</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Filtrer par outil"
          value={filter.tool}
          onChange={(e) => setFilter({ ...filter, tool: e.target.value })}
        />
      </div>

      {/* Liste des patchs */}
      <div className="grid gap-6">
        {filteredPatches.map(patch => (
          <Card key={patch.id} className={`border-l-4 ${
            patch.severity === 'critical' ? 'border-red-500' :
            patch.severity === 'high' ? 'border-orange-500' :
            patch.severity === 'medium' ? 'border-yellow-500' :
            'border-green-500'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  {patch.status === 'applied' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  {patch.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPatch(patch.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePatch(patch.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingPatch === patch.id ? (
                <div className="space-y-4">
                  <Input
                    value={patch.name}
                    onChange={(e) => updatePatch(patch.id, { name: e.target.value })}
                  />
                  <Textarea
                    value={patch.description}
                    onChange={(e) => updatePatch(patch.id, { description: e.target.value })}
                  />
                  <div className="flex gap-4">
                    <Select
                      value={patch.severity}
                      onValueChange={(value) => updatePatch(patch.id, { severity: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Gravité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={patch.status}
                      onValueChange={(value) => updatePatch(patch.id, { status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Appliqué</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="not_applicable">Non applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingPatch(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setEditingPatch(null)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">{patch.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      Outil: {patch.tool}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      patch.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      patch.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      patch.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Gravité: {patch.severity}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      patch.status === 'applied' ? 'bg-green-100 text-green-800' :
                      patch.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Statut: {patch.status}
                    </span>
                    {patch.link && (
                      <a
                        href={patch.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Lien vers le patch
                      </a>
                    )}
                  </div>
                  {patch.notes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">{patch.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 