'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  KeyRound,
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  History,
  Shield,
  Server,
  RefreshCw,
  X,
  AlertCircle,
  Database,
  Lock,
} from 'lucide-react';

interface PasswordItem {
  id: number;
  nama: string;
  ip: string | null;
  username: string;
  password: string;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
}

interface AuditLogItem {
  id: number;
  password_id: number | null;
  action: string;
  actor: string;
  detail: string;
  created_at: string;
}

export default function PasswordDirectoryPage() {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Visibility toggles per row
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PasswordItem | null>(null);
  
  // Form fields
  const [formNama, setFormNama] = useState('');
  const [formIp, setFormIp] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formKeterangan, setFormKeterangan] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal
  const [deleteCandidate, setDeleteCandidate] = useState<PasswordItem | null>(null);

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/passwords');
      const json = await res.json();
      if (json.success) {
        setPasswords(json.data);
        setLogs(json.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch passwords', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormNama('');
    setFormIp('');
    setFormUsername('');
    setFormPassword('');
    setFormKeterangan('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PasswordItem) => {
    setEditingItem(item);
    setFormNama(item.nama);
    setFormIp(item.ip || '');
    setFormUsername(item.username);
    setFormPassword(item.password);
    setFormKeterangan(item.keterangan || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formUsername.trim() || !formPassword.trim()) {
      setFormError('Nama Akun/Device, Username, dan Password wajib diisi!');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      if (editingItem) {
        // Edit mode
        const res = await fetch('/api/passwords', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            nama: formNama,
            ip: formIp,
            username: formUsername,
            password: formPassword,
            keterangan: formKeterangan,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
      } else {
        // Create mode
        const res = await fetch('/api/passwords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: formNama,
            ip: formIp,
            username: formUsername,
            password: formPassword,
            keterangan: formKeterangan,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
      }

      setIsModalOpen(false);
      fetchPasswords();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await fetch(`/api/passwords?id=${deleteCandidate.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setDeleteCandidate(null);
        fetchPasswords();
      }
    } catch (err) {
      console.error('Failed to delete password', err);
    }
  };

  const filteredPasswords = useMemo(() => {
    return passwords.filter((p) => {
      const q = search.toLowerCase();
      return (
        p.nama.toLowerCase().includes(q) ||
        (p.ip && p.ip.toLowerCase().includes(q)) ||
        p.username.toLowerCase().includes(q) ||
        (p.keterangan && p.keterangan.toLowerCase().includes(q))
      );
    });
  }, [passwords, search]);

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#eef2f6]/90 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/"
              className="neu-raised hover:text-blue-700 w-10 h-10 rounded-2xl flex items-center justify-center text-slate-600 transition-colors"
              title="Kembali ke Dashboard Utama"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-purple-700 font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    DIREKTORI PASSWORD IT
                  </span>
                  <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    VAULT
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  IT Infrastructure & Server Credential Manager
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsLogDrawerOpen(true)}
              className="neu-raised hover:text-purple-700 px-3.5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Log Audit ({logs.length})</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Password</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, IP, username..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-pressed text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
            <span>Total Kredensial: <strong className="text-slate-800">{passwords.length}</strong></span>
            <button
              onClick={fetchPasswords}
              className="neu-raised p-2 rounded-xl text-slate-600 hover:text-purple-600 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Password Table */}
        <div className="neu-raised rounded-3xl overflow-hidden border border-white/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-200/50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Nama Akun / Device / Sistem</th>
                  <th className="py-3.5 px-5 font-bold">IP Address</th>
                  <th className="py-3.5 px-5 font-bold">Username</th>
                  <th className="py-3.5 px-5 font-bold">Password</th>
                  <th className="py-3.5 px-5 font-bold">Keterangan</th>
                  <th className="py-3.5 px-5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                      Memuat kredensial dari database...
                    </td>
                  </tr>
                ) : filteredPasswords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      {search ? 'Tidak ada password yang cocok dengan pencarian.' : 'Belum ada password yang tersimpan.'}
                    </td>
                  </tr>
                ) : (
                  filteredPasswords.map((item) => {
                    const isVisible = visiblePasswords[item.id] || false;
                    return (
                      <tr key={item.id} className="hover:bg-slate-100/50 transition-colors">
                        {/* Nama */}
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span>{item.nama}</span>
                          </div>
                        </td>

                        {/* IP */}
                        <td className="py-3.5 px-5 font-mono text-xs text-slate-600">
                          {item.ip ? (
                            <span className="bg-slate-200/70 px-2 py-0.5 rounded-md">
                              {item.ip}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* Username */}
                        <td className="py-3.5 px-5 font-mono text-xs text-slate-800 font-medium">
                          <div className="flex items-center gap-1.5">
                            <span>{item.username}</span>
                            <button
                              onClick={() => copyToClipboard(item.username, item.id * 1000)}
                              className="text-slate-400 hover:text-slate-700 transition-colors"
                              title="Salin Username"
                            >
                              {copiedId === item.id * 1000 ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Password */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-lg min-w-[130px] inline-block">
                              {isVisible ? item.password : '••••••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(item.id)}
                              className="text-slate-400 hover:text-purple-600 transition-colors p-1"
                              title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(item.password, item.id)}
                              className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                              title="Salin Password"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Keterangan */}
                        <td className="py-3.5 px-5 text-xs text-slate-500 max-w-xs truncate">
                          {item.keterangan || <span className="text-slate-300">-</span>}
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 rounded-lg neu-raised hover:text-blue-600 text-slate-500 transition-colors cursor-pointer"
                              title="Edit Password"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(item)}
                              className="p-1.5 rounded-lg neu-raised hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
                              title="Hapus Password"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-raised rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-white/90 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 neu-pressed w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl neu-pressed flex items-center justify-center text-purple-600 mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {editingItem ? 'Edit Kredensial IT' : 'Tambah Kredensial IT Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data disimpan terenkripsi di PostgreSQL database internal unit.
            </p>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Akun / Device / Sistem <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Router Core Intranet, DB Postgres, Switch Lt.2"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IP Address <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 10.8.140.67"
                    value={formIp}
                    onChange={(e) => setFormIp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl neu-pressed text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: admin / postgres"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl neu-pressed text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan password kredensial..."
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan lokasi, port akses, atau kegunaan..."
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl neu-raised text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-raised rounded-3xl p-6 sm:p-7 w-full max-w-sm border border-white/90 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-2xl neu-pressed flex items-center justify-center text-rose-600 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Kredensial?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kredensial akun <strong className="text-slate-800">{deleteCandidate.nama}</strong> ({deleteCandidate.username}) akan dihapus secara permanen. Aksi ini akan dicatat di log audit.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl neu-raised text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Drawer / Modal */}
      {isLogDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-raised rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-white/90 relative max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsLogDrawerOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 neu-pressed w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-purple-700">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Audit Trail & Riwayat Perubahan</h3>
                <p className="text-xs text-slate-500">Mencatat penambahan, perubahan, dan penghapusan password IT.</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {logs.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-10">Belum ada aktivitas tercatat.</p>
              ) : (
                logs.map((log) => {
                  const actionColor =
                    log.action === 'CREATE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.action === 'UPDATE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800';

                  return (
                    <div key={log.id} className="p-3.5 rounded-2xl neu-pressed text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${actionColor}`}>
                          {log.action}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium mt-1 leading-relaxed">{log.detail}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Oleh: {log.actor}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4 text-right">
              <button
                onClick={() => setIsLogDrawerOpen(false)}
                className="px-4 py-2 rounded-xl neu-raised text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
