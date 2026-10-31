const $ = (id) => document.getElementById(id);
const heroNames = ["Akai","Kaja","Khufra","Rafaela","Uranus","Belerick","Valir","Granger","Tigreal","Franco","Atlas","Minotaur","Lolita","Brody","Estes","Grock","Natan","Hayabusa","Kadita","Cici","Odette","Miya","Fredrinn","Terizla"];
function fillHeroes(id){ const s=$(id); heroNames.forEach(h=>{const o=document.createElement("option");o.value=h;o.textContent=h;s.appendChild(o);}); }
["buildHero","myHero","enemyHero"].forEach(fillHeroes);
function showTab(name){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+name));window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.go)));
function showResult(id,title,items,extra=""){const box=$(id);box.classList.remove("hidden");box.innerHTML="";const h=document.createElement("h3");h.textContent=title;box.appendChild(h);const ul=document.createElement("ul");items.forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.appendChild(li)});box.appendChild(ul);if(extra){const p=document.createElement("p");p.textContent=extra;box.appendChild(p)}}
$("buildAnalyze").addEventListener("click",()=>{
 const hero=$("buildHero").value, role=$("buildRole").value, threat=$("threat").value, notes=$("buildNotes").value.trim();
 const threatMap={balanced:"Periksa keseimbangan physical dan magic defense sesuai sumber damage terbesar lawan.",physical:"Prioritaskan evaluasi physical defense dan efek pengurangan damage basic attack bila relevan.",magic:"Evaluasi magic defense dan sumber burst magic lawan.",heal:"Pertimbangkan item anti-heal jika tim belum memiliki sumber pengurangan regenerasi yang memadai.",attack:"Periksa kebutuhan physical defense dan item yang efektif melawan basic attack / attack speed.",cc:"Periksa kebutuhan durability dan cara menghindari atau mengurangi dampak crowd control."};
 showResult("buildResult","Checklist "+hero+" · "+role,["Sesuaikan item pertama dengan lane matchup dan kebutuhan bertahan hidup.","Cocokkan item damage/utility dengan fungsi hero dan kondisi gold.",""+threatMap[threat],"Periksa sinergi emblem dan battle spell dengan gaya bermain serta komposisi tim.","Evaluasi ulang setelah melihat item inti lawan."],notes?"Catatan kamu: "+notes:"Data patch dan komposisi lengkap belum dimasukkan; verifikasi rekomendasi dengan kondisi pertandingan aktual.");
});
$("counterAnalyze").addEventListener("click",()=>{
 const a=$("myHero").value,b=$("enemyHero").value,phase=$("matchPhase").value;
 const tips=["Bandingkan jangkauan skill, cooldown, dan kemampuan engage/disengage kedua hero.","Periksa apakah hero lawan mengandalkan burst, sustain, poke, atau crowd control.","Jangan mengambil duel tanpa mempertimbangkan level, item, jumlah pemain, dan posisi map.","Cari jendela ketika skill penting lawan sedang cooldown."];
 showResult("counterResult",a+" vs "+b,tips, "Fase pertandingan: "+phase+". Ini kerangka evaluasi umum, bukan klaim counter otomatis atau statistik win rate.");
});
$("draftAnalyze").addEventListener("click",()=>{
 const roles=[["Roam", $("dRoam").value],["Jungler",$("dJungle").value],["Mid",$("dMid").value],["EXP",$("dExp").value],["Gold",$("dGold").value]];
 const missing=roles.filter(x=>!x[1].trim()).map(x=>x[0]);
 const items=["Pastikan tim memiliki inisiasi atau cara memulai team fight.","Pastikan ada damage physical dan magic yang cukup seimbang.","Periksa wave clear, kemampuan mengambil objektif, dan perlindungan backline.","Cocokkan pilihan terakhir dengan ancaman utama lawan: "+($("draftThreat").value.trim()||"belum ditentukan")+".", "Tentukan siapa yang menjaga marksman/mage dan siapa yang membuka map."];
 if(missing.length) items.unshift("Role belum diisi: "+missing.join(", ")+". Lengkapi agar evaluasi lebih akurat.");
 else items.unshift("Semua lima role sudah diisi. Lanjutkan pemeriksaan sinergi dan matchup lane.");
 showResult("draftResult","Evaluasi komposisi tim",items);
});
$("strategyAnalyze").addEventListener("click",()=>{
 const focus=$("focus").value, condition=$("teamCondition").value.trim();
 const plans={
 early:["Prioritaskan clear wave dan trade yang menguntungkan sebelum memaksa team fight.","Gunakan keunggulan lane untuk membuka ruang invasi atau rotasi.","Jangan mengejar kill hingga kehilangan Turtle atau turret."],
 objective:["Siapkan lane lebih dahulu sebelum Turtle/Lord muncul.","Amankan vision dan posisi area sungai; jangan masuk satu per satu.","Hitung Retribution dan tunggu core berada pada posisi aman."],
 scale:["Hindari fight tanpa ultimate atau item penting.","Jaga wave agar turret tidak hilang gratis.","Bertahan dengan formasi dan cari kesalahan posisi lawan."],
 pickoff:["Manfaatkan bush dan informasi posisi lawan.","Serang target terisolasi, lalu ubah pick-off menjadi objektif.","Hindari mengejar terlalu jauh setelah mendapatkan eliminasi."],
 teamfight:["Tentukan target prioritas dan urutan inisiasi.","Jaga jarak damage dealer dari assassin dan diver lawan.","Jangan habiskan semua ultimate pada satu target tank jika backline terbuka."]
 };
 showResult("strategyResult","Battle plan",plans[focus],condition?"Kondisi tim: "+condition:"Tambahkan kondisi tim agar rencana berikutnya lebih spesifik.");
});

// Local PIN gate: convenience lock only. It is not server-side authentication.
const PIN_KEY="rdp_mlbb_pin_v1";
const lock=$("lockScreen"), app=$("app"), pinInput=$("pinInput"), pinButton=$("pinButton");
let setup=!localStorage.getItem(PIN_KEY);
function unlock(){lock.classList.add("hidden");app.classList.remove("hidden");pinInput.value="";$("pinError").textContent="";}
function lockApp(){app.classList.add("hidden");lock.classList.remove("hidden");setup=false;$("lockTitle").textContent="Masukkan PIN";$("lockHelp").textContent="Masukkan PIN untuk membuka RDP MLBB AI.";pinButton.textContent="Buka aplikasi";}
function digest(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(buf=>Array.from(new Uint8Array(buf)).map(x=>x.toString(16).padStart(2,"0")).join(""))}
pinButton.addEventListener("click",async()=>{
 const pin=pinInput.value.trim();
 if(!/^\d{4,8}$/.test(pin)){$("pinError").textContent="PIN harus terdiri dari 4–8 angka.";return;}
 if(setup){localStorage.setItem(PIN_KEY,await digest(pin));setup=false;unlock();return;}
 const saved=localStorage.getItem(PIN_KEY);
 if(await digest(pin)===saved){unlock();}else{$("pinError").textContent="PIN tidak cocok. Coba lagi.";}
});
pinInput.addEventListener("keydown",e=>{if(e.key==="Enter")pinButton.click();});
$("lockNow").addEventListener("click",lockApp);
if(!setup){$("lockTitle").textContent="Masukkan PIN";$("lockHelp").textContent="Masukkan PIN untuk membuka RDP MLBB AI.";pinButton.textContent="Buka aplikasi";}
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
