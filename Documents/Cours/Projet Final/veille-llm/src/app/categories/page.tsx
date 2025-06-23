'use client';

import { useState, useEffect } from 'react';
import { Category, PatchInfo } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [patches, setPatches] = useState<PatchInfo[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    color: '#3b82f6', // Bleu par défaut
  });
  const [newPatch, setNewPatch] = useState<Partial<PatchInfo>>({
    title: '',
    url: '',
    severity: 'medium',
    affectedTools: [],
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingPatch, setEditingPatch] = useState<string | null>(null);
  const [toolInput, setToolInput] = useState('');

  useEffect(() => {
    // Charger les catégories depuis le localStorage
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }

    // Charger les patches depuis le localStorage
    const storedPatches = localStorage.getItem('patches');
    if (storedPatches) {
      setPatches(JSON.parse(storedPatches));
    }
  }, []);

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const savePatches = (updatedPatches: PatchInfo[]) => {
    setPatches(updatedPatches);
    localStorage.setItem('patches', JSON.stringify(updatedPatches));
  };

  const handleAddCategory = () => {
    if (!newCategory.name) return;

    const category: Category = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description || '',
      color: newCategory.color || '#3b82f6',
    };

    saveCategories([...categories, category]);
    setNewCategory({ name: '', description: '', color: '#3b82f6' });
  };

  const handleEditCategory = (id: string) => {
    setEditingCategory(id);
  };

  const handleUpdateCategory = (id: string, updatedData: Partial<Category>) => {
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, ...updatedData } : cat
    );
    saveCategories(updatedCategories);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveCategories(updatedCategories);
  };

  const handleAddPatch = () => {
    if (!newPatch.title || !newPatch.url) return;

    const patch: PatchInfo = {
      id: `patch-${Date.now()}`,
      title: newPatch.title,
      url: newPatch.url,
      date: new Date().toISOString(),
      severity: newPatch.severity as 'low' | 'medium' | 'high' | 'critical',
      affectedTools: newPatch.affectedTools || [],
      description: newPatch.description || '',
    };

    savePatches([...patches, patch]);
    setNewPatch({ title: '', url: '', severity: 'medium', affectedTools: [] });
  };

  const handleEditPatch = (id: string) => {
    setEditingPatch(id);
  };

  const handleUpdatePatch = (id: string, updatedData: Partial<PatchInfo>) => {
    const updatedPatches = patches.map(patch => 
      patch.id === id ? { ...patch, ...updatedData } : patch
    );
    savePatches(updatedPatches);
    setEditingPatch(null);
  };

  const handleDeletePatch = (id: string) => {
    const updatedPatches = patches.filter(patch => patch.id !== id);
    savePatches(updatedPatches);
  };

  const handleAddTool = (patchId: string) => {
    if (!toolInput.trim()) return;

    const updatedPatches = patches.map(patch => {
      if (patch.id === patchId) {
        return {
          ...patch,
          affectedTools: [...patch.affectedTools, toolInput.trim()]
        };
      }
      return patch;
    });

    savePatches(updatedPatches);
    setToolInput('');
  };

  const handleRemoveTool = (patchId: string, toolIndex: number) => {
    const updatedPatches = patches.map(patch => {
      if (patch.id === patchId) {
        const newTools = [...patch.affectedTools];
        newTools.splice(toolIndex, 1);
        return { ...patch, affectedTools: newTools };
      }
      return patch;
    });

    savePatches(updatedPatches);
  };

  const handleToggleApplied = (patchId: string) => {
    const updatedPatches = patches.map(patch => {
      if (patch.id === patchId) {
        return {
          ...patch,
          applied: !patch.applied,
          appliedDate: !patch.applied ? new Date().toISOString() : undefined
        };
      }
      return patch;
    });

    savePatches(updatedPatches);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Gestion des Catégories et Patches</h1>
        
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="patches">Patches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ajouter une catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    placeholder="Nom de la catégorie"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Button onClick={handleAddCategory} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {editingCategory === category.id ? (
                          <Input
                            value={category.name}
                            onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          category.name
                        )}
                      </CardTitle>
                      <div className="flex gap-1">
                        {editingCategory === category.id ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleUpdateCategory(category.id, {})}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setEditingCategory(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditCategory(category.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingCategory === category.id ? (
                      <Textarea
                        value={category.description}
                        onChange={(e) => handleUpdateCategory(category.id, { description: e.target.value })}
                        className="mb-2"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                    {editingCategory === category.id && (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="color"
                          value={category.color}
                          onChange={(e) => handleUpdateCategory(category.id, { color: e.target.value })}
                          className="w-12 h-8 p-1"
                        />
                        <span className="text-xs text-muted-foreground">Couleur</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="patches">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ajouter un patch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Titre du patch"
                    value={newPatch.title}
                    onChange={(e) => setNewPatch({ ...newPatch, title: e.target.value })}
                  />
                  <Input
                    placeholder="URL du patch"
                    value={newPatch.url}
                    onChange={(e) => setNewPatch({ ...newPatch, url: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newPatch.severity}
                      onChange={(e) => setNewPatch({ ...newPatch, severity: e.target.value as any })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                      <option value="critical">Critique</option>
                    </select>
                    <Button onClick={handleAddPatch} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Description du patch"
                    value={newPatch.description}
                    onChange={(e) => setNewPatch({ ...newPatch, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {patches.map((patch) => (
                <Card key={patch.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(patch.severity)}`}>
                          {patch.severity}
                        </span>
                        {editingPatch === patch.id ? (
                          <Input
                            value={patch.title}
                            onChange={(e) => handleUpdatePatch(patch.id, { title: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          patch.title
                        )}
                      </CardTitle>
                      <div className="flex gap-1">
                        {editingPatch === patch.id ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleUpdatePatch(patch.id, {})}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setEditingPatch(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditPatch(patch.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeletePatch(patch.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleApplied(patch.id)}
                              className={patch.applied ? 'text-green-600' : 'text-gray-400'}
                            >
                              {patch.applied ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      {editingPatch === patch.id ? (
                        <Input
                          value={patch.url}
                          onChange={(e) => handleUpdatePatch(patch.id, { url: e.target.value })}
                          className="mb-2"
                        />
                      ) : (
                        <a 
                          href={patch.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {patch.url}
                        </a>
                      )}
                    </div>
                    
                    {editingPatch === patch.id ? (
                      <Textarea
                        value={patch.description}
                        onChange={(e) => handleUpdatePatch(patch.id, { description: e.target.value })}
                        className="mb-2"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mb-2">{patch.description}</p>
                    )}
                    
                    <div className="mb-2">
                      <h4 className="text-sm font-medium mb-1">Outils affectés :</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {patch.affectedTools.map((tool, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {tool}
                            {editingPatch === patch.id && (
                              <button 
                                onClick={() => handleRemoveTool(patch.id, index)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                      
                      {editingPatch === patch.id && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ajouter un outil"
                            value={toolInput}
                            onChange={(e) => setToolInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={() => handleAddTool(patch.id)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Date : {new Date(patch.date).toLocaleDateString('fr-FR')}</span>
                      {patch.applied && (
                        <span className="text-green-600">
                          Appliqué le {new Date(patch.appliedDate!).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 