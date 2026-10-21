'use client';

import React, { useState } from 'react';
import { ApplicationItem } from '@/types/app';
import { ExternalLink, Globe, Server, Cpu, KeyRound } from 'lucide-react';

interface AppCardProps {
  app: ApplicationItem;
  index?: number;
}

export const AppCard: React.FC<AppCardProps> = ({ app, index = 0 }) => {
  const [imgError, setImgError] = useState(false);

  const isInternal = app.href.startsWith('/');

  const renderFallbackIcon = () => {
    if (app.href === '/passwords') {
      return <KeyRound className="w-12 h-12 text-purple-600 transition-transform duration-300 group-hover:rotate-12" />;
    }
    switch (app.category) {
      case 'it':
        return <Server className="w-12 h-12 text-indigo-500/80 transition-transform duration-300 group-hover:scale-110" />;
      case 'unit':
        return <Cpu className="w-12 h-12 text-emerald-500/80 transition-transform duration-300 group-hover:rotate-6" />;
      default:
        return <Globe className="w-12 h-12 text-blue-500/80 transition-transform duration-300 group-hover:rotate-12" />;
    }
  };

  const categoryBadgeColors = {
    korporat: 'bg-blue-600 text-white',
    unit: 'bg-emerald-600 text-white',
    it: 'bg-purple-600 text-white',
  };

  // Stagger calculation capped at 400ms for smooth fluid appearance
  const animDelay = `${Math.min(index * 35, 420)}ms`;

  return (
    <a
      href={app.href}
      target={isInternal ? '_self' : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      style={{ animationDelay: animDelay }}
      className="animate-fade-in-up neu-raised neu-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 block text-slate-800"
    >
      <div>
        {/* Banner / Gambar Visual Aplikasi */}
        <div className="relative w-full h-44 bg-slate-100 border-b border-white/60 overflow-hidden flex items-center justify-center">
          {app.icon && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.icon}
              alt={app.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl neu-pressed flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {renderFallbackIcon()}
            </div>
          )}

          {/* Badge Kategori Melayang */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 shadow-sm">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105 ${categoryBadgeColors[app.category]}`}
            >
              {app.badge || app.category}
            </span>
          </div>
        </div>

        {/* Info Konten Card */}
        <div className="p-4">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {app.name}
          </h3>

          {app.description && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {app.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Card */}
      <div className="px-4 py-3 mx-4 mb-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-600">
        <span className="truncate max-w-[180px] text-[11px] font-mono text-slate-400 group-hover:text-slate-600">
          {app.href.replace(/^https?:\/\//, '')}
        </span>
        <div className="flex items-center gap-1 font-semibold text-[11px]">
          <span>Buka</span>
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
};
