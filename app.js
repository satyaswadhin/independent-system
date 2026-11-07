const $=id=>document.getElementById(id);
const KEY="independent-system-v1";
const today=()=>new Date().toISOString().slice(0,10);
const defaults={name:"Player",xp:0,gold:0,totalGold:0,quests:[],habits:[],log:[],habitDays:{},lastLogin:"",streak:0};
let state=load();
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...defaults}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function levelInfo(xp){let level=1,remaining=xp;while(remaining>=level*100){remaining-=level*100;level++}return {level,into:remaining,need:level*100}}
function rank(level){return level>=30?"MYTHIC":level>=20?"LEGEND":level>=12?"ELITE":level>=6?"VETERAN":level>=3?"APPRENTICE":"NOVICE"}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function dailyLogin(){if(state.lastLogin===today())return;const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);state.streak=state.lastLogin===yesterday?state.streak+1:1;state.lastLogin=today();state.xp+=5;state.gold+=2;state.totalGold+=2;state.log.unshift({title:"Daily login bonus",date:today(),xp:5,gold:2});save()}
function render(){
 const l=levelInfo(state.xp);$("playerName").textContent=state.name;$("level").textContent=String(l.level).padStart(2,"0");$("rank").textContent=rank(l.level);$("xpText").textContent=`${l.into} / ${l.need} XP`;$("xpTotal").textContent=state.xp;$("goldTotal").innerHTML=`${state.gold} <em>G</em>`;$("streakTotal").innerHTML=`${state.streak} <em>days</em>`;$("xpBar").style.width=(l.into/l.need*100)+"%";$("todayDate").textContent=new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"});
 const active=state.quests.filter(q=>!q.done);$("questCount").textContent=`${active.length} active · ${state.quests.length-active.length} completed`;
 $("questList").innerHTML=state.quests.map(q=>`<div class="quest-card ${q.done?"done":""}"><button class="check" data-quest="${q.id}" aria-label="Complete quest">${q.done?"✓":""}</button><div class="quest-info"><strong>${escapeHTML(q.title)}</strong><small>${escapeHTML(q.category)} · ${q.time||"No time set"} · ${q.difficulty}</small></div><span class="reward">+${q.xp} XP<br>+${q.gold} G</span><button class="delete" data-delete="${q.id}" aria-label="Delete quest">×</button></div>`).join("");
 $("emptyQuests").hidden=state.quests.length>0;
 $("habitList").innerHTML=state.habits.map(h=>{const done=(state.habitDays[today()]||[]).includes(h.id);return `<div class="habit-row"><button class="habit-check" data-habit="${h.id}">${done?"✓":""}</button><strong>${escapeHTML(h.title)}</strong><small>${done?"DONE TODAY":"DAILY"}</small><button class="delete" data-habit-delete="${h.id}">×</button></div>`}).join("");$("emptyHabits").hidden=state.habits.length>0;
 $("doneTotal").textContent=state.log.filter(x=>x.xp>0&&x.title!=="Daily login bonus").length;$("earnedTotal").textContent=state.totalGold;
 $("logList").innerHTML=state.log.slice(0,8).map(x=>`<div class="log-item"><div><strong>${escapeHTML(x.title)}</strong><br><small>${x.date}</small></div><span class="reward">+${x.xp} XP · +${x.gold} G</span></div>`).join("");$("emptyLog").hidden=state.log.length>0;
}
function addQuest(e){e.preventDefault();const d=$("questDifficulty").value;const values={easy:[10,5],normal:[25,12],hard:[40,20]};const [xp,gold]=values[d];state.quests.unshift({id:crypto.randomUUID(),title:$("questTitle").value.trim(),difficulty:d,xp,gold,category:$("questCategory").value,time:$("questTime").value,done:false});$("questForm").reset();$("questDialog").close();save();toast("Quest added to your board")}
function completeQuest(id){const q=state.quests.find(x=>x.id===id);if(!q||q.done)return;q.done=true;state.xp+=q.xp;state.gold+=q.gold;state.totalGold+=q.gold;state.log.unshift({title:q.title,date:today(),xp:q.xp,gold:q.gold});save();toast(`Quest complete · +${q.xp} XP`)}
function toggleHabit(id){const list=state.habitDays[today()]||[];const i=list.indexOf(id);if(i>=0){list.splice(i,1)}else{list.push(id);state.xp+=3;state.gold+=1;state.totalGold+=1;const h=state.habits.find(x=>x.id===id);state.log.unshift({title:`Habit: ${h.title}`,date:today(),xp:3,gold:1})}state.habitDays[today()]=list;save()}
$("questForm").addEventListener("submit",addQuest);
$("habitForm").addEventListener("submit",e=>{e.preventDefault();state.habits.push({id:crypto.randomUUID(),title:$("habitTitle").value.trim()});$("habitForm").reset();$("habitDialog").close();save();toast("Habit created")});
$("addQuestBtn").onclick=()=>$("questDialog").showModal();$("addHabitBtn").onclick=()=>$("habitDialog").showModal();
$("profileBtn").onclick=()=>{$("nameInput").value=state.name;$("profileDialog").showModal()};
$("profileForm").addEventListener("submit",e=>{e.preventDefault();state.name=$("nameInput").value.trim()||"Player";$("profileDialog").close();save();toast("Profile saved")});
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>b.closest("dialog").close());
document.addEventListener("click",e=>{const q=e.target.closest("[data-quest]");if(q)completeQuest(q.dataset.quest);const del=e.target.closest("[data-delete]");if(del){state.quests=state.quests.filter(x=>x.id!==del.dataset.delete);save()}const h=e.target.closest("[data-habit]");if(h)toggleHabit(h.dataset.habit);const hd=e.target.closest("[data-habit-delete]");if(hd){state.habits=state.habits.filter(x=>x.id!==hd.dataset.habitDelete);save()}});
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="independent-system-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exported")};
$("importBtn").onclick=()=>$("importFile").click();
$("importFile").onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());state={...defaults,...data};save();toast("Backup imported")}catch{toast("That backup file could not be read")}};
$("navQuests").onclick=()=>document.querySelector(".quest-panel").scrollIntoView();$("navHabits").onclick=()=>document.querySelector(".habit-list").scrollIntoView();document.querySelector(".bottom-nav a[href='#progress']").onclick=()=>document.querySelector(".overview-grid").scrollIntoView();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
dailyLogin();render();