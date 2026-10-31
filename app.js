/* RDP MLBB AI v0.2 — local rule-based build engine. No network/API calls. */
const $ = (id) => document.getElementById(id);
const heroNames = ["Akai","Kaja","Khufra","Rafaela","Uranus","Belerick","Valir","Granger","Tigreal","Franco","Atlas","Minotaur","Lolita","Brody","Estes","Grock","Natan","Hayabusa","Kadita","Cici","Odette","Miya","Fredrinn","Terizla"];
function fillHeroes(id){ const s=$(id); heroNames.forEach(h=>{const o=document.createElement("option");o.value=h;o.textContent=h;s.appendChild(o);}); }
["buildHero","myHero","enemyHero"].forEach(fillHeroes);
function showTab(name){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+name));window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.go)));
function showResult(id,title,items,extra=""){const box=$(id);box.classList.remove("hidden");box.innerHTML="";const h=document.createElement("h3");h.textContent=title;box.appendChild(h);const ul=document.createElement("ul");items.forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.appendChild(li)});box.appendChild(ul);if(extra){const p=document.createElement("p");p.textContent=extra;box.appendChild(p)}}
function addBuildSection(parent,title,lines){const section=document.createElement("section");section.className="build-section";const h=document.createElement("h4");h.textContent=title;section.appendChild(h);const ul=document.createElement("ol");lines.forEach(line=>{const li=document.createElement("li");li.textContent=line;ul.appendChild(li)});section.appendChild(ul);parent.appendChild(section)}
const itemNames={boots:"Tough Boots",dom:"Dominance Ice",antique:"Antique Cuirass",athena:"Athena's Shield",radiant:"Radiant Armor",blade:"Blade Armor",immortal:"Immortality",guardian:"Guardian Helmet",thunder:"Thunder Belt",oracle:"Oracle",brute:"Brute Force Breastplate",necklace:"Necklace of Durance",sea:"Sea Halberd",malefic:"Malefic Roar",winter:"Winter Crown"};
function makeAkaiBuild(threat,notes){
 let items=[`${itemNames.boots} — prioritaskan ketahanan terhadap CC/magic; aktifkan Roam blessing sesuai kebutuhan tim (Conceal untuk engage/rotasi).`,`${itemNames.dom} — anti-heal dan pengurangan attack speed; kuat saat lawan punya sustain atau basic attack.`,`${itemNames.antique} — untuk mengurangi tekanan physical skill/burst dari fighter atau assassin.`,`${itemNames.athena} — pilihan utama menghadapi magic burst.`,`${itemNames.immortal} — tambahan kesempatan hidup saat team fight penentu.`,`${itemNames.guardian} — regen dan durability saat perlu bertahan lama di map.`];
 let swaps=[];
 if(threat==="physical"){items[3]=`${itemNames.blade} — ganti slot magic defense bila ancaman physical menjadi sumber damage utama.`;swaps.push("Jika physical burst berasal dari skill, pertahankan Antique Cuirass; jika basic attack marksman dominan, Blade Armor lebih relevan.")}
 if(threat==="magic"){items[2]=`${itemNames.athena} — percepat bila lawan punya mage burst.`;items[3]=`${itemNames.radiant} — ganti/masukkan bila magic damage datang berulang (DPS), bukan satu ledakan.`;swaps.push("Pilih Athena untuk burst magic; Radiant untuk magic damage berulang. Jangan otomatis membeli keduanya jika slot lebih dibutuhkan.")}
 if(threat==="heal"){items[1]=`${itemNames.dom} — jadikan prioritas awal untuk mengurangi regen/healing lawan.`;swaps.push("Pastikan efek anti-heal aktif sebelum team fight; koordinasikan agar tim tidak membeli efek yang sama tanpa kebutuhan.")}
 if(threat==="attack"){items[1]=`${itemNames.blade} — prioritaskan terhadap marksman/basic attack yang sangat dominan.`;items[2]=`${itemNames.dom} — perlambat attack speed dan kurangi sustain lawan.`;swaps.push("Jika damage marksman sangat tinggi, pertimbangkan Blade Armor lebih awal; tetap evaluasi apakah lawan juga memiliki physical skill burst.")}
 if(threat==="cc"){items[0]=`${itemNames.boots} — Tough Boots untuk mengurangi dampak CC; sesuaikan bila sumber CC tidak relevan.`;swaps.push("Gunakan Flicker untuk reposisi/engage atau keluar dari posisi buruk; jangan memaksa ultimate sebelum skill kunci lawan terpakai.")}
 if(notes && /assassin|physical burst|fighter burst/i.test(notes)) swaps.push("Catatan menyebut burst/assassin: pertimbangkan Antique Cuirass lebih awal dan jaga posisi untuk melindungi backline.");
 if(notes && /marksman|attack speed/i.test(notes)) swaps.push("Catatan menyebut marksman/attack speed: prioritaskan Blade Armor atau Dominance Ice sesuai sumber damage dan kebutuhan anti-heal.");
 if(!swaps.length) swaps.push("Sesuaikan slot ke-6 dengan komposisi aktual: Blade Armor untuk basic attack, Radiant untuk magic DPS, atau Oracle bila shield/heal diri menjadi fokus.");
 return {items,swaps,spell:"Flicker (opsi utama untuk mengatur posisi ultimate/engage). Vengeance dapat dipilih bila tugasmu lebih banyak menyerap damage dan komposisi lawan mengandalkan serangan langsung.",emblem:"Tank Emblem — talent awal Vitality, talent kedua Tenacity, talent inti Concussive Blast sebagai baseline durability. Periksa nama/efek talent di client setelah patch.",play:["Gunakan ultimate untuk memisahkan target penting atau mengganggu formasi; arahkan lawan menjauh dari backline tim.","Jangan membuka war tanpa follow-up damage dari jungler/midlaner.","Simpan skill untuk peel ketika assassin/diver masuk ke marksman atau mage tim.","Dekati Turtle/Lord lebih awal bersama tim; kontrol area dan bush sebelum objektif muncul."],aggressive:["Tough Boots (Roam/Conceal)","Thunder Belt — durability dan tekanan tambahan setelah stack terbentuk","Dominance Ice — anti-heal/attack speed","Antique Cuirass — physical skill defense","Blade Armor atau Athena's Shield — pilih sesuai damage lawan","Immortality — opsi team fight"],defensive:["Tough Boots (Roam/Conceal)","Dominance Ice","Antique Cuirass","Athena's Shield atau Radiant Armor","Blade Armor","Immortality"]};
}
function genericBuild(hero,role,threat){
 const tank=["Roamer","Jungler","EXP Lane"].includes(role);
 const physical=threat==="physical"||threat==="attack";
 const magic=threat==="magic";
 const items=tank?["Tough Boots / Warrior Boots — pilih berdasarkan CC/magic atau physical pressure.","Dominance Ice — anti-heal/attack speed bila relevan.",physical?"Antique Cuirass atau Blade Armor — pilih sesuai physical skill atau basic attack.":"Antique Cuirass — physical skill defense.",magic?"Athena's Shield (burst) atau Radiant Armor (magic DPS).":"Athena's Shield — jika mage burst lawan mengancam.","Immortality — untuk team fight penting.","Guardian Helmet / Oracle / item defense situasional — sesuaikan kit hero dan damage lawan."]:["Tough Boots / Magic Shoes — pilih ketahanan atau cooldown sesuai kebutuhan hero.","Item core damage/utility sesuai skill hero — jangan membeli item tank tanpa alasan matchup.","Item penetrasi atau damage kedua sesuai tipe damage hero.",physical?"Wind of Nature (marksman) atau physical defense situasional.":"Athena's Shield / Radiant Armor jika lawan punya magic burst/DPS.","Immortality atau Winter Crown untuk survivability.","Item situasional: anti-heal (Sea Halberd/Necklace of Durance), penetrasi, atau defense tambahan."];
 return {items,swaps:["Ini template awal berbasis role, bukan build khusus yang sudah divalidasi untuk hero ini.","Periksa skill scaling, tipe damage, cooldown, dan item core hero sebelum membeli.",threat==="heal"?"Tambahkan item anti-heal yang cocok dengan role (Dominance Ice, Sea Halberd, atau Necklace of Durance).":"Evaluasi ulang setelah melihat dua item inti lawan."],spell:tank?"Flicker untuk engage/escape; Vengeance atau Purify dapat dipertimbangkan sesuai kit dan ancaman lawan.":"Pilih battle spell sesuai role dan kit: Retribution untuk jungler; Flicker/Purify untuk kebutuhan mobilitas atau anti-CC; Inspire/Aegis sesuai hero.",emblem:"Pilih emblem sesuai role dan scaling hero. Tank/Support untuk utility dan durability; Assassin/Fighter/Mage/Marksman untuk kebutuhan damage. Talent harus disesuaikan dengan kit hero.",play:["Mainkan sesuai power spike level dan item hero.","Perhatikan minimap dan posisi roamer sebelum mengambil duel.","Jangan memaksakan objektif ketika lane belum siap atau jumlah pemain kalah.","Ubah item berikutnya berdasarkan damage dan sustain lawan yang benar-benar terlihat."],aggressive:["Boots sesuai role","Item core damage hero","Item damage/penetrasi kedua","Item utility atau anti-heal","Item damage situasional","Immortality/Winter Crown bila diperlukan"],defensive:["Boots defensif sesuai matchup","Item core yang tetap mendukung fungsi hero","Dominance Ice atau anti-heal sesuai role","Antique Cuirass / Blade Armor untuk physical","Athena's Shield / Radiant Armor untuk magic","Immortality atau defense situasional"]};
}
$("buildAnalyze").addEventListener("click",()=>{
 const hero=$("buildHero").value,role=$("buildRole").value,threat=$("threat").value,notes=$("buildNotes").value.trim();
 const data=hero==="Akai"&&role==="Roamer"?makeAkaiBuild(threat,notes):genericBuild(hero,role,threat);
 const box=$("buildResult");box.classList.remove("hidden");box.innerHTML="";
 const h=document.createElement("h3");h.textContent=`Build recommendation · ${hero} · ${role}`;box.appendChild(h);
 const note=document.createElement("p");note.textContent="RDP Engine v0.2 · rekomendasi lokal berbasis aturan. Bukan data meta/win rate real-time. Urutan dapat berubah mengikuti gold, lane, dan item lawan.";box.appendChild(note);
 addBuildSection(box,"1. Urutan 6 item",data.items);
 addBuildSection(box,"2. Emblem & talent",[data.emblem]);
 addBuildSection(box,"3. Battle Spell",[data.spell]);
 addBuildSection(box,"4. Counter item & penyesuaian",data.swaps);
 addBuildSection(box,"5. Cara bermain",data.play);
 addBuildSection(box,"6. Build alternatif — agresif",data.aggressive);
 addBuildSection(box,"Build alternatif — defensif",data.defensive);
 if(notes){const p=document.createElement("p");p.textContent="Catatan pertandingan: "+notes;box.appendChild(p)}
});
$("counterAnalyze").addEventListener("click",()=>{
 const a=$("myHero").value,b=$("enemyHero").value,phase=$("matchPhase").value;
 const tips=["Bandingkan jangkauan skill, cooldown, dan kemampuan engage/disengage kedua hero.","Periksa apakah hero lawan mengandalkan burst, sustain, poke, atau crowd control.","Jangan mengambil duel tanpa mempertimbangkan level, item, jumlah pemain, dan posisi map.","Cari jendela ketika skill penting lawan sedang cooldown."];
 showResult("counterResult",a+" vs "+b,tips,"Fase pertandingan: "+phase+". Ini kerangka evaluasi umum, bukan klaim counter otomatis atau statistik win rate.");
});
$("draftAnalyze").addEventListener("click",()=>{
 const roles=[["Roam",$("dRoam").value],["Jungler",$("dJungle").value],["Mid",$("dMid").value],["EXP",$("dExp").value],["Gold",$("dGold").value]];
 const missing=roles.filter(x=>!x[1].trim()).map(x=>x[0]);
 const items=["Pastikan tim memiliki inisiasi atau cara memulai team fight.","Pastikan ada damage physical dan magic yang cukup seimbang.","Periksa wave clear, kemampuan mengambil objektif, dan perlindungan backline.","Cocokkan pilihan terakhir dengan ancaman utama lawan: "+($("draftThreat").value.trim()||"belum ditentukan")+".","Tentukan siapa yang menjaga marksman/mage dan siapa yang membuka map."];
 if(missing.length)items.unshift("Role belum diisi: "+missing.join(", ")+". Lengkapi agar evaluasi lebih akurat.");else items.unshift("Semua lima role sudah diisi. Lanjutkan pemeriksaan sinergi dan matchup lane.");
 showResult("draftResult","Evaluasi komposisi tim",items);
});
$("strategyAnalyze").addEventListener("click",()=>{
 const focus=$("focus").value,condition=$("teamCondition").value.trim();
 const plans={early:["Prioritaskan clear wave dan trade yang menguntungkan sebelum memaksa team fight.","Gunakan keunggulan lane untuk membuka ruang invasi atau rotasi.","Jangan mengejar kill hingga kehilangan Turtle atau turret."],objective:["Siapkan lane lebih dahulu sebelum Turtle/Lord muncul.","Amankan vision dan posisi area sungai; jangan masuk satu per satu.","Hitung Retribution dan tunggu core berada pada posisi aman."],scale:["Hindari fight tanpa ultimate atau item penting.","Jaga wave agar turret tidak hilang gratis.","Bertahan dengan formasi dan cari kesalahan posisi lawan."],pickoff:["Manfaatkan bush dan informasi posisi lawan.","Serang target terisolasi, lalu ubah pick-off menjadi objektif.","Hindari mengejar terlalu jauh setelah mendapatkan eliminasi."],teamfight:["Tentukan target prioritas dan urutan inisiasi.","Jaga jarak damage dealer dari assassin dan diver lawan.","Jangan habiskan semua ultimate pada satu target tank jika backline terbuka."]};
 showResult("strategyResult","Battle plan",plans[focus],condition?"Kondisi tim: "+condition:"Tambahkan kondisi tim agar rencana berikutnya lebih spesifik.");
});
// Local PIN gate: convenience lock only. It is not server-side authentication.
const PIN_KEY="rdp_mlbb_pin_v1";
const lock=$("lockScreen"),app=$("app"),pinInput=$("pinInput"),pinButton=$("pinButton");
let setup=!localStorage.getItem(PIN_KEY);
function unlock(){lock.classList.add("hidden");app.classList.remove("hidden");pinInput.value="";$("pinError").textContent="";}
function lockApp(){app.classList.add("hidden");lock.classList.remove("hidden");setup=false;$("lockTitle").textContent="Masukkan PIN";$("lockHelp").textContent="Masukkan PIN untuk membuka RDP MLBB AI.";pinButton.textContent="Buka aplikasi";}
function digest(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(buf=>Array.from(new Uint8Array(buf)).map(x=>x.toString(16).padStart(2,"0")).join(""))}
pinButton.addEventListener("click",async()=>{const pin=pinInput.value.trim();if(!/^\d{4,8}$/.test(pin)){$("pinError").textContent="PIN harus terdiri dari 4–8 angka.";return;}if(setup){localStorage.setItem(PIN_KEY,await digest(pin));setup=false;unlock();return;}const saved=localStorage.getItem(PIN_KEY);if(await digest(pin)===saved){unlock();}else{$("pinError").textContent="PIN tidak cocok. Coba lagi.";}});
pinInput.addEventListener("keydown",e=>{if(e.key==="Enter")pinButton.click();});
$("lockNow").addEventListener("click",lockApp);
if(!setup){$("lockTitle").textContent="Masukkan PIN";$("lockHelp").textContent="Masukkan PIN untuk membuka RDP MLBB AI.";pinButton.textContent="Buka aplikasi";}
const chip=document.querySelector(".banner-chip");if(chip)chip.textContent="● MODE PRIBADI · VERSI 0.2";
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
