// components/FluxCard.tsx
import { FluxSource } from "@/types/flux";
import { BadgeCheck, Link as LinkIcon } from "lucide-react";

interface Props {
  flux: FluxSource;
}

export default function FluxCard({ flux }: Props) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{flux.name}</h3>
        {flux.enabled && (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <BadgeCheck className="w-4 h-4" /> Actif
          </span>
        )}
      </div>

      <a
        href={flux.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline inline-flex items-center gap-1"
      >
        <LinkIcon className="w-4 h-4" /> {flux.url.length > 50 ? flux.url.slice(0, 50) + '...' : flux.url}
      </a>

      <div className="flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
          Type: {flux.type}
        </span>
        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
          Thème: {flux.theme}
        </span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
          Ajouté le {new Date(flux.addedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
