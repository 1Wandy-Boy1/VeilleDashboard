import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Contactez-nous</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Informations de contact</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">Développeur</h3>
                <p className="text-muted-foreground">
                  <strong>Jorge Castellanos</strong><br />
                  Étudiant en Expert en cybersécurité
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:jorge.castellanos@ynov.com" className="text-blue-600 hover:underline">
                    jorge.castellanos@ynov.com
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">À propos du projet</h3>
                <p className="text-muted-foreground">
                  Ce site est un projet de fin d'année pour le titre RNCP de Expert en cybersécurité,
                  spécifiquement dans le domaine de la veille informatique sur les LLM et l'IA.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">Disponibilité</h3>
                <p className="text-muted-foreground">
                  Je suis disponible pour répondre à vos questions concernant ce projet
                  et la veille technologique sur les LLM et l'IA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 