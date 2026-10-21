# Dashboard Internal Unit PLTGU - PLN Indonesia Power

Dashboard launcher portal aplikasi terpadu untuk internal unit pembangkit PLTGU, memadukan **Aplikasi Korporat**, **Aplikasi Unit**, dan **IT Area** dengan gaya **Neumorphic & Corporate Blue PLN**.

---

## 🗂️ Kategori Aplikasi

1. **Aplikasi Korporat**: 
   - Diambil langsung dari portal `https://aplikasi.plnindonesiapower.co.id/app/` (terdapat 73 aplikasi bawaan korporat beserta redirect link dan logonya).
   - Dilengkapi route API otomatis untuk sync ulang kapan saja: `/api/sync-corporate`.
2. **Aplikasi Unit**: 
   - Berisi aplikasi operasional internal pembangkit (Logsheet Digital, Heat Rate monitoring, Water Treatment, Arsip Manual).
   - Diatur melalui file JSON yang mudah diedit: `src/data/apps-unit.json`.
3. **IT Area**: 
   - Khusus perlengkapan & monitoring tim IT lokal (Zabbix, Proxmox VE, Portainer, GLPI Asset Management, DNS).
   - Diatur melalui file JSON: `src/data/apps-it.json`.

---

## 🚀 Menjalankan Secara Lokal (Development)

```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🐳 Deployment di Server Ubuntu (Docker)

Project sudah siap di-deploy langsung menggunakan **Docker** & **docker-compose** di server Ubuntu intranet Anda:

```bash
# Build dan jalankan container di background
docker compose up -d --build
```

Dashboard akan otomatis aktif di port `3000` (`http://<ip-server-ubuntu>:3000`).

---

## 📝 Menambahkan Aplikasi Unit atau IT

Cukup edit file JSON terkait:
- **Aplikasi Unit**: edit file [apps-unit.json](file:///d:/pltgu-dashboard/src/data/apps-unit.json)
- **IT Area**: edit file [apps-it.json](file:///d:/pltgu-dashboard/src/data/apps-it.json)

Format data:
```json
{
  "name": "Nama Aplikasi",
  "description": "Keterangan singkat fungsi aplikasi",
  "href": "http://10.x.x.x/app",
  "badge": "Operasi / Pemeliharaan / IT",
  "category": "unit"
}
```
Setelah diubah, data langsung teraplikasikan.
