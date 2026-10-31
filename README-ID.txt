RDP MLBB AI — PWA tahap pertama

ISI:
- Dashboard mobile dark premium
- PIN lokal 4–8 digit (dibuat saat pertama dibuka)
- Build checklist berdasarkan role dan ancaman
- Counter matchup worksheet
- Draft composition checker
- Battle strategy planner
- PWA manifest dan service worker untuk instalasi/offline cache

CARA DEPLOY GRATIS:
1. Buat akun GitHub bila belum punya.
2. Buat repository baru, misalnya rdp-mlbb-ai.
3. Upload semua isi folder ini (index.html, styles.css, app.js, manifest.webmanifest, sw.js, icon-192.png, icon-512.png).
4. Di repository: Settings > Pages > Build and deployment > Deploy from a branch.
5. Pilih branch main dan folder /(root), lalu Save.
6. Tunggu GitHub Pages menerbitkan URL. Buka URL itu di Safari iPhone.
7. Safari > tombol Share > Add to Home Screen > Add.

CATATAN PENTING PRIVASI:
PIN pada versi ini adalah pengunci lokal untuk kenyamanan, bukan autentikasi server. Karena aplikasi statis di-host publik, orang yang mengetahui URL dapat mengakses file aplikasi dan melewati pengunci dengan kemampuan teknis tertentu. Jangan simpan data sensitif. Untuk privasi sungguhan, tahap berikutnya perlu Cloudflare Access atau backend dengan autentikasi. Jangan menaruh OpenAI API key di file JavaScript/front-end.

FITUR:
- Build/counter/draft/strategy saat ini adalah worksheet dan checklist analisis generik.
- Belum ada AI online, database patch resmi, sinkronisasi, atau data win rate live.
- Semua input pertandingan diproses lokal di browser; tidak dikirim ke server.
