import React from 'react';

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">À propos de Veille LLM</h1>
        
        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Notre Mission</h2>
          <p className="text-muted-foreground mb-4">
            Veille LLM est une plateforme dédiée à la veille technologique sur les modèles de langage (LLM) et l'intelligence artificielle.
            Notre objectif est de vous tenir informé des dernières avancées, innovations et tendances dans ce domaine en rapide évolution.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Ce que nous faisons</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Agrégation de sources fiables sur les LLM et l'IA</li>
            <li>Analyse et synthèse des informations pertinentes</li>
            <li>Mise à jour quotidienne des actualités</li>
            <li>Organisation des articles par catégories</li>
            <li>Filtrage intelligent du contenu</li>
          </ul>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">À propos du Projet</h2>
          <p className="text-muted-foreground mb-4">
            Ce site fait partie d'un projet de fin d'année pour le titre RNCP de Expert en cybersécurité, 
            spécifiquement dans le domaine de la veille informatique. L'objectif est de démontrer la capacité 
            à mettre en place un système de veille technologique efficace et moderne.
          </p>
          <p className="text-muted-foreground mb-4">
            Le projet a été entièrement réalisé par un seul étudiant, Jorge Castellanos, qui a conçu, 
            développé et déployé cette plateforme de veille technologique sur les LLM et l'IA.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Technologies Utilisées</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Next.js - Framework React pour le développement frontend et backend</li>
            <li>TypeScript - Pour un code plus robuste et maintenable</li>
            <li>Tailwind CSS - Pour un design moderne et responsive</li>
            <li>RSS Parser - Pour l'agrégation de flux RSS</li>
            <li>LocalStorage - Pour la persistance des données côté client</li>
            <li>Lucide Icons - Pour les icônes modernes et cohérentes</li>
          </ul>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">L'Auteur</h2>
          <p className="text-muted-foreground mb-4">
            <strong>Jorge Castellanos</strong> est un étudiant passionné par la cybersécurité et les technologies émergentes.
            Ce projet de veille technologique a été développé dans le cadre de sa formation d'Expert en cybersécurité,
            démontrant sa capacité à créer des solutions innovantes pour la veille informatique.
          </p>
          <p className="text-muted-foreground">
            Nous croyons en la transparence et l'accessibilité de l'information, c'est pourquoi
            nous nous efforçons de rendre notre plateforme la plus intuitive et utile possible.
          </p>
        </div>
      </div>
    </div>
  );
} 