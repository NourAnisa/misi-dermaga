/* Pure game model. Shared by browser and Node's tests; no dependencies. */
(function(root){
'use strict';
const SPRITES={playerDown:[83,47,158,249],playerRight:[387,47,142,236],playerUp:[702,47,157,247],playerLeft:[1027,47,146,236],key:[78,388,173,192],chestClosed:[367,395,211,183],chestOpen:[676,359,216,242],lantern:[1038,342,128,269],supplyBag:[49,692,227,195],doorClosed:[376,644,199,243],doorOpen:[689,644,193,270],generator:[989,694,218,203],lighthouse:[65,930,198,301],tree:[337,953,267,270],bench:[673,986,246,220],radio:[1024,951,137,256]};
const OBJECTS=[
 {id:'key',name:'Kunci emas',x:185,y:285,w:28,sprite:'key',tags:['Fungsional','Interaktif','Resource'],action:'Ambil kunci',role:'Membuka pintu jembatan.',rule:'Diambil satu kali dan dikonsumsi saat pintu dibuka.',story:'Kunci penjaga tertinggal ketika badai datang.'},
 {id:'chest',name:'Peti persediaan',x:463,y:244,w:65,sprite:'chestClosed',solid:24,tags:['Fungsional','Interaktif'],action:'Buka peti',role:'Menyediakan satu unit bahan bakar.',rule:'Peti dapat dibuka tanpa kunci. Isinya hanya bisa diambil satu kali.',story:'Persediaan disimpan agar tetap kering.'},
 {id:'door',name:'Pintu jembatan',x:650,y:359,w:63,sprite:'doorClosed',tags:['Fungsional','Interaktif'],action:'Buka pintu',role:'Mengontrol akses ke pulau mercusuar.',rule:'Memerlukan kunci emas. Setelah dibuka, jalan dapat dilewati.',story:'Penjaga mengunci jalur sebelum meninggalkan dermaga.'},
 {id:'generator',name:'Generator',x:819,y:373,w:68,sprite:'generator',solid:24,tags:['Fungsional','Interaktif'],action:'Isi generator',role:'Memasok listrik ke mercusuar.',rule:'Memerlukan dan mengonsumsi satu unit bahan bakar.',story:'Generator berhenti setelah badai.'},
 {id:'lighthouse',name:'Mercusuar',x:839,y:243,w:105,sprite:'lighthouse',solid:30,tags:['Fungsional','Interaktif'],action:'Nyalakan mercusuar',role:'Menjadi tujuan akhir sekaligus penunjuk arah perahu.',rule:'Hanya dapat dinyalakan setelah generator hidup.',story:'Cahayanya menuntun perahu terakhir pulang.'},
 {id:'radio',name:'Radio penjaga',x:328,y:224,w:27,sprite:'radio',tags:['Interaktif'],action:'Dengarkan radio',role:'Menyampaikan petunjuk dan informasi cerita.',rule:'Dapat didengarkan berkali-kali; tidak mengubah inventori.',story:'“Di sini perahu terakhir. Kabut makin tebal. Kami menunggu cahaya.”'},
 {id:'medkit',name:'Tas obat',x:161,y:442,w:43,sprite:'supplyBag',tags:['Fungsional','Interaktif','Resource'],action:'Ambil obat',role:'Memulihkan kondisi Raka.',rule:'Ambil sekali, lalu tekan Q. Menambah 30 HP, maksimum 100.',story:'Bekal pertolongan ditinggalkan tim relawan.'},
 {id:'lamp',name:'Lampu dermaga',x:508,y:453,w:39,sprite:'lantern',solid:13,tags:['Interaktif','Dekoratif'],action:'Ubah lampu',role:'Memberi penerangan lokal dan suasana.',rule:'Bisa dinyalakan atau dimatikan. Tidak memengaruhi syarat kemenangan.',story:'Satu lampu masih memiliki daya cadangan.'},
 {id:'bench',name:'Bangku tua',x:303,y:411,w:79,sprite:'bench',solid:25,tags:['Dekoratif'],role:'Membangun konteks tempat menunggu perahu.',rule:'Tidak memberi item atau aksi gameplay; kaki bangku menghalangi gerak.',story:'Bangku yang kosong mengisyaratkan dermaga telah dievakuasi.'},
 {id:'tree',name:'Pohon tepi dermaga',x:119,y:242,w:105,sprite:'tree',solid:18,tags:['Dekoratif'],role:'Membingkai lingkungan tropis dan memberi pembanding skala.',rule:'Tidak bisa diambil; batang menjadi penghalang fisik.',story:'Daun yang rimbun memperkuat lokasi dermaga sungai.'},
 {id:'tree2',name:'Pohon di ujung dermaga',x:527,y:212,w:90,sprite:'tree',solid:16,tags:['Dekoratif'],role:'Membuat siluet area mudah dikenali.',rule:'Tidak dapat digunakan; batang menghalangi gerakan.',story:'Pohon menjadi penanda ujung jalur.'},
 {id:'oil',name:'Tumpahan oli',x:397,y:346,w:68,sprite:null,tags:['Fungsional'],role:'Menciptakan tantangan lingkungan.',rule:'Kondisi berkurang 10 HP per detik saat berdiri di oli.',story:'Kerusakan setelah badai meninggalkan jejak di lantai.'}
];
const LAND=[{x:80,y:160,w:480,h:340},{x:560,y:300,w:200,h:100},{x:760,y:160,w:160,h:300},{x:240,y:500,w:160,h:60}];
const STEPS=[['keyTaken','Ambil kunci emas','Di sisi kiri dermaga'],['chestOpen','Buka peti persediaan','Temukan bahan bakar'],['doorOpen','Buka pintu jembatan','Kunci menjadi syarat akses'],['generatorOn','Hidupkan generator','Gunakan bahan bakar'],['won','Nyalakan mercusuar','Beri tanda untuk perahu']];
function fresh(){return {player:{x:320,y:478,dir:'Down'},hp:70,keyTaken:false,key:false,chestOpen:false,fuel:false,doorOpen:false,generatorOn:false,won:false,medTaken:false,med:false,lampOn:true,failed:false,elapsed:0,oilTime:0,interactions:0};}
function onLand(x,y){return LAND.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);}
function canWalk(s,x,y){
 if(![[x-9,y-9],[x+9,y-9],[x-9,y+9],[x+9,y+9]].every(p=>onLand(...p)))return false;
 if(!s.doorOpen&&x>626&&x<674&&y>288&&y<412)return false;
 return !OBJECTS.some(o=>o.solid&&Math.hypot(x-o.x,y-o.y)<o.solid+8);
}
function move(s,dx,dy){if(s.won||s.failed)return; if(canWalk(s,s.player.x+dx,s.player.y))s.player.x+=dx;if(canWalk(s,s.player.x,s.player.y+dy))s.player.y+=dy;}
function removed(s,o){return (o.id==='key'&&s.keyTaken)||(o.id==='medkit'&&s.medTaken);}
function act(s,id,requireNear=true){
 const o=OBJECTS.find(a=>a.id===id);if(!o)return {ok:false,title:'Objek tidak ditemukan',text:''};
 if(s.won||s.failed)return {ok:false,title:'Misi sudah selesai',text:'Ulangi misi untuk bermain kembali.'};
 if(requireNear&&Math.hypot(s.player.x-o.x,s.player.y-o.y)>72)return {ok:false,title:'Dekati objek',text:'Berjalan lebih dekat untuk berinteraksi.'};
 let result; const done=(title,text)=>({ok:true,title,text});const no=(title,text)=>({ok:false,title,text});
 switch(id){
 case 'key':if(s.keyTaken)return no('Kunci sudah diambil','Kunci hanya tersedia satu kali.');s.keyTaken=s.key=true;result=done('Kunci diperoleh','Sekarang pintu jembatan dapat dibuka. Cari juga peti persediaan.');break;
 case 'chest':if(s.chestOpen)return no('Peti sudah kosong','Bahan bakar hanya tersedia satu kali.');s.chestOpen=s.fuel=true;result=done('Bahan bakar diperoleh','Satu unit bahan bakar tersimpan di inventori.');break;
 case 'door':if(s.doorOpen)return no('Jalur sudah terbuka','Lanjutkan menuju generator di seberang.');if(!s.key)return no('Pintu terkunci','Perlu kunci emas. Carilah di sisi kiri dermaga.');s.doorOpen=true;s.key=false;result=done('Pintu terbuka','Kunci digunakan. Sekarang jembatan dapat dilewati.');break;
 case 'generator':if(s.generatorOn)return no('Generator sudah hidup','Aktifkan mercusuar di sebelah utara.');if(!s.fuel)return no('Bahan bakar belum ada','Ambil bahan bakar dari peti persediaan.');s.generatorOn=true;s.fuel=false;result=done('Listrik kembali','Generator mengonsumsi bahan bakar. Kini nyalakan mercusuar.');break;
 case 'lighthouse':if(!s.generatorOn)return no('Mercusuar belum mendapat listrik','Hidupkan generator terlebih dahulu.');s.won=true;result=done('Dermaga kembali bercahaya','Perahu menemukan jalan pulang. Misi berhasil!');break;
 case 'medkit':if(s.medTaken)return no('Tas obat sudah diambil','Gunakan Q jika obat masih tersedia.');s.medTaken=s.med=true;result=done('Obat diperoleh','Tekan Q atau tombol Obat untuk memulihkan 30 HP.');break;
 case 'lamp':s.lampOn=!s.lampOn;result=done(s.lampOn?'Lampu dinyalakan':'Lampu dimatikan','Amati perubahan visual. Ini contoh interaksi dan feedback.');break;
 case 'radio':result=done('Pesan dari perahu',o.story);break;
 default:return no(o.name,o.story+' Objek ini dapat diamati melalui mode belajar.');
 }s.interactions++;return result;
}
function heal(s){if(s.won||s.failed)return {ok:false,title:'Misi sudah selesai',text:'Ulangi untuk bermain lagi.'};if(!s.med)return {ok:false,title:'Obat belum tersedia',text:'Ambil tas obat di sisi kiri bawah dermaga.'};if(s.hp>=100)return {ok:false,title:'Kondisi sudah penuh',text:'Obat tetap tersimpan.'};s.hp=Math.min(100,s.hp+30);s.med=false;return {ok:true,title:'Kondisi dipulihkan',text:'Obat digunakan satu kali. Kondisi bertambah hingga 30 HP.'};}
function tick(s,dt){if(s.won||s.failed)return;s.elapsed+=dt;if(Math.hypot(s.player.x-397,s.player.y-346)<33){s.oilTime+=dt;while(s.oilTime>=1){s.oilTime-=1;s.hp=Math.max(0,s.hp-10);if(!s.hp){s.failed=true;break;}}}else s.oilTime=0;}
/* Breadth-first navigation on a 20 px grid, respecting the same collision rule as keyboard movement. */
function findPath(s,tx,ty,range=12){
 const step=20,cols=48,rows=30,start={x:Math.floor(s.player.x/step),y:Math.floor(s.player.y/step)};
 const key=(x,y)=>y*cols+x;const queue=[start],prev=new Map([[key(start.x,start.y),null]]);let end=null;
 for(let i=0;i<queue.length;i++){const p=queue[i],wx=p.x*step+10,wy=p.y*step+10;if(Math.hypot(wx-tx,wy-ty)<=range){end=p;break;}
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,k=key(x,y);if(x<0||y<0||x>=cols||y>=rows||prev.has(k)||!canWalk(s,x*step+10,y*step+10))continue;prev.set(k,p);queue.push({x,y});}}
 if(!end)return null;const path=[];let p=end;while(p){path.unshift({x:p.x*step+10,y:p.y*step+10});p=prev.get(key(p.x,p.y));}return path;
}
const api={SPRITES,OBJECTS,LAND,STEPS,fresh,onLand,canWalk,move,removed,act,heal,tick,findPath};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Dermaga=api;
})(typeof window!=='undefined'?window:globalThis);
