'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ApplicationItem, CategoryKey } from '@/types/app';
import { AppCard } from '@/components/AppCard';
import {
  Search,
  Building2,
  Cpu,
  ShieldAlert,
  LayoutGrid,
  Zap,
  Layers,
  Lock,
  Unlock,
  KeyRound,
  X,
  LogOut,
} from 'lucide-react';

interface DashboardClientProps {
  initialApps: ApplicationItem[];
}

export default function DashboardClient({ initialApps }: DashboardClientProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryKey>('all');
  
  // Auth state for IT Area
  const [isItAuthenticated, setIsItAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Default password fallback if not specified in env
  const correctPassword = process.env.NEXT_PUBLIC_IT_AREA_PASSWORD || 'adminit123';

  // Check session storage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('it_area_auth');
    if (savedAuth === 'true') {
      setIsItAuthenticated(true);
    }
  }, []);

  const handleTabChange = (key: CategoryKey) => {
    if (key === 'it') {
      if (isItAuthenticated) {
        setActiveTab('it');
      } else {
        setInputPassword('');
        setPasswordError(false);
        setShowPasswordModal(true);
      }
    } else {
      setActiveTab(key);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === correctPassword) {
      setIsItAuthenticated(true);
      sessionStorage.setItem('it_area_auth', 'true');
      setShowPasswordModal(false);
      setActiveTab('it');
      setPasswordError(false);
      setInputPassword('');
    } else {
      setPasswordError(true);
    }
  };

  const handleLockItArea = () => {
    setIsItAuthenticated(false);
    sessionStorage.removeItem('it_area_auth');
    setActiveTab('all');
  };

  // Filter rules:
  // 1. Pada tab 'all': Aplikasi 'it' TIDAK BOLEH muncul.
  // 2. Pada tab 'it': Hanya aplikasi 'it' yang muncul jika sudah terautentikasi.
  // 3. Tab lain ('korporat' / 'unit'): Sesuai kategori masing-masing.
  const filteredApps = useMemo(() => {
    return initialApps.filter((app) => {
      const matchSearch =
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(search.toLowerCase())) ||
        (app.badge && app.badge.toLowerCase().includes(search.toLowerCase()));

      if (activeTab === 'all') {
        // Exclude IT area from 'Semua Aplikasi'
        return matchSearch && app.category !== 'it';
      }

      if (activeTab === 'it') {
        return matchSearch && app.category === 'it';
      }

      return matchSearch && app.category === activeTab;
    });
  }, [initialApps, search, activeTab]);

  const counts = useMemo(() => {
    return {
      all: initialApps.filter((a) => a.category !== 'it').length,
      korporat: initialApps.filter((a) => a.category === 'korporat').length,
      unit: initialApps.filter((a) => a.category === 'unit').length,
      it: initialApps.filter((a) => a.category === 'it').length,
    };
  }, [initialApps]);

  const tabs = [
    { key: 'all' as CategoryKey, label: 'Semua Aplikasi', icon: LayoutGrid, count: counts.all, isProtected: false },
    { key: 'korporat' as CategoryKey, label: 'Aplikasi Korporat', icon: Building2, count: counts.korporat, isProtected: false },
    { key: 'unit' as CategoryKey, label: 'Aplikasi Unit', icon: Cpu, count: counts.unit, isProtected: false },
    { key: 'it' as CategoryKey, label: 'IT Area', icon: ShieldAlert, count: counts.it, isProtected: true },
  ];

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#eef2f6]/90 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Unit identity */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="h-12 w-auto px-3.5 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-pln-indonesiapower.png"
                alt="PLN Indonesia Power"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  PORTAL INTERNAL UNIT
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                PT PLN Indonesia Power • Unit Bisnis Pembangkitan Cilegon
              </p>
            </div>
          </div>

          {/* Search Bar - Neumorphic Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aplikasi korporat atau unit..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-pressed text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Banner Khusus Saat IT Area Terbuka */}
        {activeTab === 'it' && (
          <div className="neu-raised rounded-3xl p-6 mb-8 border border-white/80 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">
                    IT Area & Infrastructure Management
                  </h1>
                  <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200">
                    <Unlock className="w-3.5 h-3.5" /> Terbuka
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Area monitoring server lokal, hypervisor, dan sistem manajemen tiket IT internal unit PLTGU.
                </p>
              </div>

              {isItAuthenticated && (
                <button
                  onClick={handleLockItArea}
                  className="neu-raised hover:text-rose-600 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer w-fit"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Kunci IT Area
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Tabs (Neumorphic Buttons) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'neu-pressed text-blue-700 ring-1 ring-blue-500/20 font-bold'
                    : 'neu-raised text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.isProtected && (
                  <span>
                    {isItAuthenticated ? (
                      <Unlock className="w-3 h-3 text-emerald-600 inline" />
                    ) : (
                      <Lock className="w-3 h-3 text-amber-600 inline" />
                    )}
                  </span>
                )}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section Notice for Empty Search */}
        {filteredApps.length === 0 ? (
          <div className="neu-raised rounded-3xl p-12 text-center my-8">
            <p className="text-base font-semibold text-slate-700">Tidak ada aplikasi yang ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">Coba kata kunci pencarian yang lain.</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveTab('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl neu-pressed text-xs font-semibold text-blue-600"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredApps.map((app, idx) => (
              <AppCard key={`${app.category}-${app.name}-${idx}`} app={app} />
            ))}
          </div>
        )}
      </main>

      {/* Password Authentication Modal for IT Area */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-raised rounded-3xl p-6 sm:p-8 w-full max-w-md border border-white/90 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 neu-pressed w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl neu-pressed flex items-center justify-center text-purple-600 mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Akses Terbatas: IT Area</h3>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan password pengelola IT unit untuk membuka launcher aplikasi dan infrastruktur lokal.
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Ketik password IT Area..."
                  className={`w-full px-4 py-3 rounded-xl neu-pressed text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    passwordError ? 'ring-2 ring-rose-500/80 bg-rose-50/20' : 'focus:ring-2 focus:ring-purple-500/30'
                  }`}
                />
                {passwordError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1.5 pl-1">
                    Password salah. Silakan coba kembali.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl neu-raised text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Buka Kunci
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 py-6 text-center text-xs text-slate-500 bg-[#eef2f6]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 PT PLN Indonesia Power • UBP Cilegon</span>
          <span className="text-[11px] text-slate-400">
            Sistem Informasi
          </span>
        </div>
      </footer>
    </div>
  );
}
