const $ = id => document.getElementById(id);
const ingredients = ['sauce', 'cheese', 'pepperoni', 'mushroom', 'basil', 'olive', 'ham', 'pineapple', 'pepper', 'onion', 'chicken', 'corn'];
const names = {sauce:'Tomato sauce',cheese:'Mozzarella',pepperoni:'Pepperoni',mushroom:'Mushrooms',basil:'Fresh basil',olive:'Olives',ham:'Ham',pineapple:'Pineapple',pepper:'Bell peppers',onion:'Red onion',chicken:'Chicken',corn:'Sweetcorn'};
const orders = [
  {name:'Mia',avatar:'👩🏽',description:'Your next regular',quote:'A classic margherita, please. Tomato, cheese, and fresh basil!',items:['sauce','cheese','basil'],price:12},
  {name:'Leo',avatar:'👨🏻',description:'On his lunch break',quote:'Pepperoni pizza! Just sauce, cheese, and pepperoni for me.',items:['sauce','cheese','pepperoni'],price:14},
  {name:'Sam',avatar:'🧑🏾',description:'Loves a veggie slice',quote:'A garden pizza, please! Sauce, cheese, mushrooms, bell peppers, and red onion.',items:['sauce','cheese','mushroom','pepper','onion'],price:18},
  {name:'Ava',avatar:'👩🏼',description:'A tropical pizza fan',quote:'Hawaiian for me! Tomato sauce, mozzarella, ham, and pineapple.',items:['sauce','cheese','ham','pineapple'],price:16},
  {name:'Oliver',avatar:'👨🏽',description:'Loves a loaded pizza',quote:'Sauce and cheese with pepperoni, chicken, and bell peppers, please!',items:['sauce','cheese','pepperoni','chicken','pepper'],price:20},
  {name:'Zoe',avatar:'👩🏾',description:'A mushroom enthusiast',quote:'Could I get sauce, cheese, mushrooms, basil, and sweetcorn?',items:['sauce','cheese','mushroom','basil','corn'],price:18},
  {name:'Max',avatar:'🧑🏻',description:'Knows what he likes',quote:'Sauce, cheese, pepperoni, and olives. Thanks, chef!',items:['sauce','cheese','pepperoni','olive'],price:16},
  {name:'Ruby',avatar:'👩🏻',description:'Here for the chicken pizza',quote:'Tomato sauce, cheese, chicken, sweetcorn, and red onion, please.',items:['sauce','cheese','chicken','corn','onion'],price:20},
  {name:'Finn',avatar:'🧑🏼',description:'A fan of the classics',quote:'Just sauce and cheese today. Keep it simple!',items:['sauce','cheese'],price:10},
  {name:'Alex',avatar:'🧑🏽',description:'Has a very specific order',quote:'Sauce, cheese, ham, mushrooms, and olives. No pineapple, thanks!',items:['sauce','cheese','ham','mushroom','olive'],price:18}
];
const upgrades = {
  oven:{title:'Quick-fire oven',icon:'♨',description:'Bake faster. Each level cuts 0.6 seconds.',costs:[45,85,180],unlock:[1,1,6],max:3},
  seating:{title:'Cosy waiting area',icon:'☕',description:'Give customers 5 extra seconds per level.',costs:[35,65,150],unlock:[1,1,6],max:3},
  tips:{title:'A little extra charm',icon:'✦',description:'Earn an extra 5% tip per level on perfect orders.',costs:[55,95,200],unlock:[1,1,6],max:3}
};
const branchLocations = [
  {name:'Market Street',icon:'🏪',cost:200,day:3},
  {name:'Harbour Slice',icon:'🌊',cost:400,day:6},
  {name:'Station Square',icon:'🚉',cost:750,day:9},
  {name:'City Centre',icon:'🏙️',cost:1250,day:12},
  {name:'Northside Pizzeria',icon:'🌳',cost:2000,day:15}
];
const hiringCosts = [75,125,200];
const assistantCosts = [60,100,150];
const dayEvents = [
  {id:'market',icon:'🌿',name:'Farmers’ market',detail:'Fresh veggie specials sell for 35% more.',goal:'Serve 3 perfect pizzas',target:3},
  {id:'rush',icon:'⚡',name:'Lunch rush',detail:'Customers have 12 fewer seconds. Orders pay 25% more.',goal:'Serve 3 pizzas with at least half their patience left',target:3},
  {id:'critic',icon:'⭐',name:'The critic is coming',detail:'A VIP arrives as your fifth customer with a high-value custom order.',goal:'Serve the critic a perfect pizza',target:1},
  {id:'white',icon:'🧀',name:'White pizza Wednesday',detail:'No tomato sauce today. Cheese-based specials pay 30% more.',goal:'Serve 3 perfect white pizzas',target:3},
  {id:'festival',icon:'🎉',name:'Pizza festival',detail:'Loaded custom combos, 8 extra seconds, and 40% bigger orders.',goal:'Serve 3 perfect festival pizzas',target:3}
];
const crewNames = ['Jamie','Riley','Casey','Morgan','Alex','Charlie','Taylor','Jordan','Sam','Avery','Quinn','Dakota','Robin','Emery','Blake','Cameron','Skyler','Drew'];
const crewAvatars = ['👩🏽‍🍳','👨🏻‍🍳','🧑🏾‍🍳','👩🏼‍🍳','👨🏽‍🍳','🧑🏻‍🍳'];
const OPEN_TIME = 8 * 60;
const CLOSE_TIME = 18 * 60;
const MINUTES_PER_SECOND = 2.5;
const freshState = () => ({earnings:0,sold:0,day:1,completed:0,ratingTotal:0,ratingCount:0,spent:0,perfect:0,streak:0,bestStreak:0,dayStart:0,seed:Math.floor(Math.random()*1000000),upgrades:{oven:0,seating:0,tips:0},history:[],primaryWorkers:0,branches:[],networkTicks:0,networkIncome:0,dayWins:0,dayFast:0,dayVip:0,challengePaid:false,challengesWon:0,currentStore:0,team:[],nextWorker:1,kitchens:Array(6).fill(null),homeIncome:0,homeSold:0,victorySeen:false,clockMinutes:OPEN_TIME,storeTickets:Array(6).fill(0),autoEnabled:Array(6).fill(true)});
function safeKitchen(pizza){
  const recipe=pizza?.order;
  if(!recipe||!Array.isArray(recipe.items)||!recipe.items.length||recipe.items.some(item=>!ingredients.includes(item))||!Number.isFinite(recipe.price)||recipe.price<=0||['name','description','avatar','quote'].some(key=>typeof recipe[key]!=='string'))return null;
  return {
    selected:Array.isArray(pizza.selected)?pizza.selected.filter(item=>ingredients.includes(item)):[],
    baked:!!pizza.baked,baking:!!pizza.baking,remaining:Number.isFinite(pizza.remaining)?Math.max(1,pizza.remaining):75,
    started:!!pizza.started,ovenTicks:Number.isFinite(pizza.ovenTicks)?Math.max(0,Math.min(30,pizza.ovenTicks)):0,
    crewProgress:Number.isFinite(pizza.crewProgress)?Math.max(0,Math.min(6,pizza.crewProgress)):0,paused:!!pizza.paused,
    order:{name:recipe.name.slice(0,80),description:recipe.description.slice(0,200),avatar:recipe.avatar.slice(0,20),quote:recipe.quote.slice(0,600),items:[...new Set(recipe.items)],price:recipe.price,vip:recipe.vip===true}
  };
}
function normalizeState(value){
  const result={...freshState(),...value};
  for(const field of ['spent','perfect','streak','bestStreak','dayStart','seed','networkTicks','networkIncome','dayWins','dayFast','dayVip','challengesWon','homeIncome','homeSold']){
    if(!Number.isFinite(result[field])||result[field]<0)result[field]=0;
  }
  // Earlier background worker sales counted perfect pizzas but skipped the streak.
  // A completely perfect sales history lets us recover the exact streak safely.
  if(result.sold>0 && result.perfect===result.sold && result.ratingCount===result.sold && result.ratingTotal===result.sold*5){
    result.streak=result.sold;result.bestStreak=Math.max(result.bestStreak,result.streak);
  }
  result.spent=Math.min(result.spent,result.earnings);result.dayStart=Math.min(result.dayStart,result.earnings);
  result.upgrades=Object.fromEntries(Object.keys(upgrades).map(key=>[key,Math.max(0,Math.min(upgrades[key].max,Number.isInteger(value.upgrades?.[key])?value.upgrades[key]:0))]));
  result.primaryWorkers=Math.max(0,Math.min(3,Number.isInteger(value.primaryWorkers)?value.primaryWorkers:0));
  result.branches=Array.isArray(value.branches)?value.branches.slice(0,branchLocations.length).map(branch=>({workers:Math.max(0,Math.min(3,Number.isInteger(branch?.workers)?branch.workers:0)),income:Number.isFinite(branch?.income)&&branch.income>=0?branch.income:0,sold:Number.isInteger(branch?.sold)&&branch.sold>=0?branch.sold:0,upgrades:Object.fromEntries(Object.keys(upgrades).map(key=>[key,Math.max(0,Math.min(upgrades[key].max,Number.isInteger(branch?.upgrades?.[key])?branch.upgrades[key]:0))]))})):[];
  result.currentStore=Number.isInteger(value.currentStore)&&value.currentStore>=0&&value.currentStore<=result.branches.length?value.currentStore:0;
  result.kitchens=Array.from({length:6},(_,index)=>Array.isArray(value.kitchens)&&value.kitchens[index]&&typeof value.kitchens[index]==='object'?safeKitchen(value.kitchens[index]):null);
  const legacyCrew=[];
  for(let store=0;store<=result.branches.length;store++){
    const count=store===0?result.primaryWorkers:result.branches[store-1].workers;
    for(let i=0;i<count;i++)legacyCrew.push({id:`crew-${legacyCrew.length+1}`,name:crewNames[legacyCrew.length],avatar:crewAvatars[legacyCrew.length%crewAvatars.length],store});
  }
  const seen=new Set();
  result.team=(Array.isArray(value.team)?value.team:legacyCrew).slice(0,18).filter(worker=>{
    if(!worker||typeof worker.id!=='string'||seen.has(worker.id))return false;seen.add(worker.id);return true;
  }).map((worker,index)=>({id:worker.id.slice(0,40),name:typeof worker.name==='string'?worker.name.slice(0,24):crewNames[index],avatar:crewAvatars[index%crewAvatars.length],store:Number.isInteger(worker.store)&&worker.store>=0&&worker.store<=result.branches.length?worker.store:-1}));
  // Oversized imported teams go to the bench rather than disappearing.
  for(let store=0;store<=result.branches.length;store++)result.team.filter(worker=>worker.store===store).slice(3).forEach(worker=>worker.store=-1);
  result.primaryWorkers=result.team.filter(worker=>worker.store===0).length;
  result.branches.forEach((branch,index)=>branch.workers=result.team.filter(worker=>worker.store===index+1).length);
  result.nextWorker=Math.max(1,Number.isInteger(value.nextWorker)?value.nextWorker:1,...result.team.map(worker=>(Number(worker.id.replace('crew-',''))||0)+1));
  result.clockMinutes=Number.isFinite(value.clockMinutes)?Math.max(OPEN_TIME,Math.min(CLOSE_TIME,Math.floor(value.clockMinutes))):OPEN_TIME;
  result.storeTickets=Array.from({length:6},(_,index)=>Number.isSafeInteger(value.storeTickets?.[index])&&value.storeTickets[index]>=0?value.storeTickets[index]:0);
  result.autoEnabled=Array.from({length:6},(_,index)=>value.autoEnabled?.[index]!==false);
  result.victorySeen=value.victorySeen===true;
  result.networkTicks=Math.floor(result.networkTicks)%10;result.challengePaid=value.challengePaid===true;
  result.history=Array.isArray(value.history)?value.history.filter(line=>typeof line==='string').slice(0,5):[];
  return result;
}
const wallet = () => Math.max(0,Math.round((state.earnings-state.spent)*100)/100);
const activeUpgrades = () => state.currentStore===0?state.upgrades:state.branches[state.currentStore-1].upgrades;
const staffAt = store => state.team.filter(worker=>worker.store===store).length;
const bakeTicks = () => Math.max(6,30-activeUpgrades().oven*6-staffAt(state.currentStore)*2);
const STORAGE_KEY = 'slice-society-saves-v2';
const saveFileName = (slot,index) => {
  if(typeof slot?.saveName==='string' && slot.saveName.trim())return slot.saveName.trim().slice(0,28);
  // Old versions stored the save title in the home shop's name field.
  const legacy=typeof slot?.name==='string'?slot.name.trim():'';
  return legacy && legacy!=='Corner Slice' && !/^Shop [1-3]$/.test(legacy) ? legacy.slice(0,28) : `Save ${index+1}`;
};
const validState = value => value && ['earnings','sold','day','completed','ratingTotal','ratingCount'].every(k=>Number.isFinite(value[k])&&value[k]>=0) && Number.isInteger(value.day) && value.day>=1 && Number.isSafeInteger(value.completed) && value.ratingTotal<=value.ratingCount*5;
let saves = {active:0,slots:[null,null,null]};
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (stored && Array.isArray(stored.slots) && stored.slots.length===3) {
    saves.slots = stored.slots.map((slot,index)=>slot && validState(slot.state) ? {...slot,state:normalizeState(slot.state),saveName:saveFileName(slot,index),name:'Corner Slice'} : null);
    saves.active = Number.isInteger(stored.active) && stored.active>=0 && stored.active<3 ? stored.active : 0;
  } else {
    const legacy = JSON.parse(localStorage.getItem('slice-society-v1'));
    if (validState(legacy)) saves.slots[0] = {state:normalizeState(legacy)};
  }
} catch {storageAvailable=false;}
let state = freshState();
let selected = new Set(), baked=false, baking=false, serving=false, remaining=75, timer=null, ovenTimer=null, ovenTicks=0, order=null;
let resetAll = false;
let paused = false;
let startScreenOpen = true;
let gameLoaded = false;
let selectedStartSlot = saves.active;
let soundEnabled = false;
let audioContext = null;
let pendingDelete = null;
let gameView = 'kitchen';
let crewProgress = 0;
const money = n => `$${n.toFixed(2)}`;
function save(){
  if(!gameLoaded)return;
  const pizza=kitchenSnapshot();state.kitchens[state.currentStore]=pizza;
  saves.slots[saves.active] = {name:'Corner Slice',saveName:saveFileName(saves.slots[saves.active],saves.active),state:JSON.parse(JSON.stringify(state)),pizza,updated:Date.now()};
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saves));storageAvailable=true;}catch{storageAvailable=false;}
  $('save-status').textContent=storageAvailable?'AUTOSAVE ON':'SAVES LAST FOR THIS VISIT';
  $('active-save').textContent=saveFileName(saves.slots[saves.active],saves.active);
  $('active-slot-label').textContent=`SAVE ${saves.active+1} / 3`;
}
function renderStartMenu(){
  $('start-save-slots').replaceChildren(...saves.slots.map((slot,index)=>{
    const button=document.createElement('button');button.className='start-save-card';
    button.setAttribute('aria-pressed',String(index===selectedStartSlot));
    const number=document.createElement('span');number.className='start-slot-number';number.textContent=String(index+1).padStart(2,'0');
    const details=document.createElement('span');details.className='start-slot-details';
    const name=document.createElement('strong');name.textContent=saveFileName(slot,index);
    const summary=document.createElement('small');summary.textContent=slot?`Day ${slot.state.day} · ${money(slot.state.earnings-slot.state.spent)} cash · ${slot.state.sold} pizzas`:'Empty slot · A new empire starts here';
    details.append(name,summary);
    const marker=document.createElement('span');marker.className='start-slot-marker';marker.textContent=index===selectedStartSlot?'✓':'+';marker.setAttribute('aria-hidden','true');
    button.append(number,details,marker);
    button.addEventListener('click',()=>{selectedStartSlot=index;renderStartMenu();$('start-save-slots').children[index].focus();});
    return button;
  }));
  const slot=saves.slots[selectedStartSlot];
  $('start-selection').textContent=slot?`Continue ${saveFileName(slot,selectedStartSlot)} · Day ${slot.state.day}`:`Start a new game in Save ${selectedStartSlot+1}`;
  $('start-button').textContent=slot?'Continue game →':'Start game →';
  $('start-storage-note').textContent=storageAvailable?'Progress saves in this browser':'Saves only last for this visit';
  $('start-sound-button').textContent=soundEnabled?'♪ Sound on':'♪ Sound off';
  $('start-sound-button').setAttribute('aria-pressed',String(soundEnabled));
}
function startGame(){
  if(!startScreenOpen)return;
  if(gameLoaded)save();
  const needsLoad=!gameLoaded||saves.active!==selectedStartSlot;
  if(needsLoad){clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;saves.active=selectedStartSlot;gameLoaded=true;loadSlot();}
  startScreenOpen=false;
  $('start-screen').hidden=true;$('game-shell').hidden=false;
  renderPause();$('pause-button').focus();
}
function showStartMenu(){
  if(!gameLoaded||startScreenOpen)return;
  save();startScreenOpen=true;selectedStartSlot=saves.active;
  $('game-shell').hidden=true;$('start-screen').hidden=false;
  $('toast').hidden=true;renderStartMenu();$('start-title').focus();
}
function saveMenu(){
  $('save-slots').replaceChildren(...saves.slots.map((slot,index)=>{
    const row=document.createElement('div');row.className='save-slot-row';
    const button=document.createElement('button');button.className='save-slot';
    button.setAttribute('aria-pressed',String(index===saves.active));
    const name=document.createElement('strong');name.textContent=`Slot ${index+1} · ${saveFileName(slot,index)}${index===saves.active?' · Playing':''}`;
    const summary=document.createElement('span');summary.textContent=slot?`Day ${slot.state.day} · ${money(slot.state.earnings)} · ${slot.state.sold} pizzas sold`:'Empty slot · Start a new shop';
    button.append(name,summary);button.addEventListener('click',()=>{switchSlot(index);$('saves-dialog').close();});
    row.append(button);
    if(slot){
      const remove=document.createElement('button');remove.className='delete-save';remove.textContent='Delete';
      remove.setAttribute('aria-label',`Delete Save ${index+1} save`);
      remove.addEventListener('click',()=>{
        pendingDelete=index;$('delete-description').textContent=`Delete Save ${index+1} and all its progress? Your other saves will stay saved.${index===saves.active?' You’ll switch to another shop.':''} This cannot be undone.`;
        openDialog('delete-dialog');
      });
      row.append(remove);
    }
    return row;
  }));
}
function kitchenSnapshot(){return {selected:[...selected],baked,baking,remaining,started:timer!==null,ovenTicks,paused,crewProgress,order:order?{...order,items:[...order.items]}:null};}
function renderOrder(){
  if(!order)return;
  $('customer-name').textContent=order.name;$('customer-description').textContent=order.description;$('avatar').textContent=order.avatar;$('request').textContent=order.quote;
  $('order-number').textContent=`#${String(state.storeTickets[state.currentStore]+1).padStart(3,'0')}`;
  $('recipe').replaceChildren(...order.items.map(item=>{const li=document.createElement('li');li.textContent=names[item];return li;}));$('price').textContent=money(order.price);$('next-day').hidden=true;
}
function loadKitchen(pizza){
  newOrder();
  if(order && pizza && Array.isArray(pizza.selected)){
    const savedOrder=pizza.order;
    if(savedOrder && Array.isArray(savedOrder.items)&&savedOrder.items.length && savedOrder.items.every(item=>ingredients.includes(item)) && Number.isFinite(savedOrder.price)&&savedOrder.price>0 && ['name','description','avatar','quote'].every(key=>typeof savedOrder[key]==='string')){
      order={...savedOrder,items:[...new Set(savedOrder.items)]};renderOrder();
    }
    crewProgress=Number.isFinite(pizza.crewProgress)?Math.max(0,Math.min(10,pizza.crewProgress)):0;
    selected=new Set(pizza.selected.filter(item=>ingredients.includes(item)));
    remaining=Number.isFinite(pizza.remaining)?Math.max(1,Math.min(patienceLimit(),pizza.remaining)):patienceLimit();
    baked=!!pizza.baked&&selected.size>0;
    if(pizza.started)startTimer();
    if(pizza.baking&&selected.size&&!baked)startOven(Math.max(0,Math.min(bakeTicks()-1,Number.isInteger(pizza.ovenTicks)?pizza.ovenTicks:0)));
    renderPizza();patience();
  }
  if(order)$('activity').textContent=`You’re running ${locationName(state.currentStore)}. Ready for the next pizza?`;
  stats();renderPause();renderLog();
}
function loadSlot(){
  const slot=saves.slots[saves.active];state=slot?normalizeState(slot.state):freshState();paused=!!slot?.pizza?.paused;
  gameView='kitchen';
  loadKitchen(state.kitchens[state.currentStore]||slot?.pizza);
  setView('kitchen');save();
}
function changeStore(store){
  if(!Number.isInteger(store)||store<0||store>state.branches.length)return false;
  if(store===state.currentStore){setView('kitchen');return true;}
  save();clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;
  state.currentStore=store;loadKitchen(state.kitchens[store]);setView('kitchen');save();showToast(`Now running ${locationName(store)}`);return true;
}
function switchSlot(index){
  if(!Number.isInteger(index)||index<0||index>2||index===saves.active)return;
  save();clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;
  saves.active=index;loadSlot();
}
function deleteSlot(index){
  if(!Number.isInteger(index)||index<0||index>2||!saves.slots[index])return;
  save();
  saves.slots[index]=null;
  if(index===saves.active){
    clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;
    const existing=saves.slots.findIndex((slot,i)=>i!==index&&slot!==null);
    saves.active=existing>=0?existing:(index+1)%3;
    loadSlot();
  } else save();
  saveMenu();
}
function restartShop(all=false){
  clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;
  if(all){saves={active:0,slots:[null,null,null]};try{localStorage.removeItem('slice-society-v1');}catch{}}
  else saves.slots[saves.active]=null;
  loadSlot();$('activity').textContent='A fresh shop. Your first customer is here!';
}
function stats(){
  $('earnings').textContent=money(state.earnings);
  $('sold').innerHTML=`${state.sold} <small>pizzas served</small>`;
  const rating=state.ratingCount ? state.ratingTotal/state.ratingCount : 5;
  $('reputation').innerHTML=`${rating.toFixed(1)} <small class="stars">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5-Math.round(rating))}</small>`;
  $('shift').innerHTML=`Day ${state.day} <small>${formatTime(state.clockMinutes)} · ${state.completed} customers</small>`;
  $('goal-count').textContent=`${state.completed} customers served`;
  $('wallet').textContent=money(wallet());
  $('streak-count').textContent=`${state.streak} in a row`;
  $('day-income').textContent=money(state.earnings-state.dayStart);
  $('shift-summary').hidden=!shiftClosed();
  $('summary-income').textContent=money(state.earnings-state.dayStart);
  $('summary-total').textContent=`${state.completed} customers today · ${state.sold} lifetime pizzas sold`;
  $('shop-name-display').textContent=locationName(state.currentStore);
  $('shop-sign-name').textContent=locationName(state.currentStore);
  $('equipment-shop-name').textContent=locationName(state.currentStore);
  $('current-location').textContent=locationName(state.currentStore);
  $('hud-wallet').textContent=money(wallet());
  $('hud-day').textContent=`DAY ${state.day}`;
  $('hud-orders').textContent=formatTime(state.clockMinutes);
  $('hud-customers').textContent=`${state.completed} customers`;
  $('opening-status').textContent=shiftClosed()?'CLOSED':'OPEN';
  $('kitchen-team').textContent=`${staffAt(state.currentStore)} crew · ${(bakeTicks()/10).toFixed(1)}s oven`;
  $('badge-count').textContent=`${achievements().filter(badge=>badge.unlocked).length} / ${achievements().length}`;
  $('level-label').textContent=state.sold>=50?'NEIGHBOURHOOD LEGEND':state.sold>=20?'LOCAL FAVOURITE':state.sold>=5?'RISING PIZZA STAR':'NEW KID ON THE BLOCK';
  $('store-count').textContent=String(1+state.branches.length);
  $('worker-count').textContent=String(state.primaryWorkers+state.branches.reduce((sum,branch)=>sum+branch.workers,0));
  $('network-income').textContent=money(state.networkIncome);
  $('map-summary').textContent=`${state.branches.length+1} / 6 stores · ${state.team.length} crew · ${formatTime(state.clockMinutes)} · Shops close at 6 PM`;
  $('map-owned').textContent=`${state.branches.length+1} / 6`;
  $('map-working').textContent=String(state.team.filter(worker=>worker.store>=0).length);
  $('map-takings').textContent=money(state.earnings-state.dayStart);
  $('map-hours').textContent=`${shiftClosed()?'Closed':'Open'} · ${formatTime(state.clockMinutes)}`;
  $('journal-perfect').textContent=String(state.perfect);
  $('journal-streak').textContent=String(state.bestStreak);
  $('journal-challenges').textContent=String(state.challengesWon);
  $('empire-track-fill').style.width=`${(state.branches.length+1+state.team.filter(worker=>worker.store>=0).length)/24*100}%`;
  renderEvent();
  $('empire-progress').textContent=`${state.branches.length+1} / 6 shops · ${state.team.filter(worker=>worker.store>=0).length} / 18 assigned crew`;
  checkVictory();
  $('shift-progress').style.width=`${(state.clockMinutes-OPEN_TIME)/(CLOSE_TIME-OPEN_TIME)*100}%`;
  renderAutomation();
  if(gameView==='map')refreshMapActivity();
}
function controls(){
  const finished=shiftClosed() || isPaused() || crewInControl();
  document.querySelectorAll('[data-ingredient]').forEach(button=>{button.disabled=baking||baked||serving||finished;button.setAttribute('aria-pressed',selected.has(button.dataset.ingredient));});
  $('bake-button').disabled=baking||baked||serving||finished||!selected.size;
  $('serve-button').disabled=!baked||serving||finished;
  $('clear-button').disabled=serving||finished||(!selected.size&&!baking&&!baked);
}
const patienceLimit = () => Math.max(60, 75 - (state.day - 1) * 3) + activeUpgrades().seating*5 + (currentEvent()?.id==='rush'?-12:currentEvent()?.id==='festival'?8:0);
// Interleave ingredients along a sunflower spiral to fill the whole pizza.
// Every piece gets its own position, including on pizzas with many toppings.
function toppingPosition(index, total) {
  const radius = 42 * Math.sqrt((index + 0.5) / total);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
}
function renderPizza(){
  $('pizza').className=`pizza${selected.has('sauce')?' has-sauce':''}${selected.has('cheese')?' has-cheese':''}${baked?' baked':''}`;
  $('toppings').replaceChildren();
  const active = ingredients.filter(ingredient => ingredient !== 'sauce' && ingredient !== 'cheese' && selected.has(ingredient));
  const piecesPerTopping = active.length > 4 ? 6 : 10;
  active.forEach((ingredient, layer) => {
    for (let i = 0; i < piecesPerTopping; i++) {
      const index = i * active.length + layer;
      const [x, y] = toppingPosition(index, active.length * piecesPerTopping);
      const piece = document.createElement('span');
      piece.className = `topping ${ingredient}`;
      piece.style.left = `${x}%`;
      piece.style.top = `${y}%`;
      piece.style.transform = `translate(-50%, -50%) rotate(${index * 47}deg)`;
      if (ingredient === 'mushroom') piece.textContent = '🍄';
      $('toppings').append(piece);
    }
  });
  $('pizza-description').textContent=baked?'Golden, hot, and ready to serve.':selected.size?[...selected].map(i=>names[i]).join(' · '):'Fresh dough. A fresh start.';
  $('pizza').setAttribute('aria-label',`${baked?'Baked pizza':'Pizza'}: ${selected.size?[...selected].map(item=>names[item]).join(', '):'fresh dough'}`);
  $('pizza-status').textContent=baking?'IN THE OVEN':baked?'READY TO SERVE':'READY TO CREATE';
  controls();
}
function patience(){
  $('patience-bar').style.width=`${remaining/patienceLimit()*100}%`;
  $('patience-bar').style.background=remaining<25?'#c95336':'#8da274';
  $('patience-text').textContent=isPaused()?'Paused':timer?`${remaining}s remaining`:'Starts with first ingredient';
  $('patience-track').setAttribute('aria-valuenow',String(remaining));$('patience-track').setAttribute('aria-valuemax',String(patienceLimit()));
}
function startTimer(){if(timer||shiftClosed())return;timer=setInterval(()=>{if(isPaused())return;remaining--;patience();if(remaining<=0)finishOrder(true);else save();},1000);patience();}
function clearPizza(){
  clearInterval(ovenTimer);ovenTimer=null;ovenTicks=0;baking=false;baked=false;
  $('bake-overlay').hidden=true;$('bake-progress').style.width='0%';
  selected.clear();crewProgress=0;renderPizza();
}
function newOrder(){
  renderEvent();
  clearInterval(timer);timer=null;remaining=patienceLimit();serving=false;clearPizza();patience();
  if(shiftClosed()){
    order=null;$('customer-name').textContent='Shift complete!';$('customer-description').textContent='Time to take a well-earned break';$('avatar').textContent='🎉';$('request').textContent='It’s 6 PM! The shops are closed. Open the next day to welcome more customers.';$('recipe').replaceChildren();$('price').textContent='See you soon';$('next-day').hidden=false;$('next-day').textContent=`Open for day ${state.day+1} ↗`;$('activity').textContent=`Day ${state.day} complete! Total shop earnings: ${money(state.earnings)}.`;controls();return;
  }
  order=orderForDay();renderOrder();
}
function recordPerfectResult(perfect){
  if(!perfect){state.streak=0;return 0;}
  state.perfect++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);
  return Math.min(2,Math.max(0,state.streak-1)*.25);
}
function finishOrder(expired=false,automated=false){
  if(serving||!order||shiftClosed())return;serving=true;clearInterval(timer);timer=null;clearInterval(ovenTimer);ovenTimer=null;baking=false;$('bake-overlay').hidden=true;
  const missing=order.items.filter(item=>!selected.has(item));const extra=[...selected].filter(item=>!order.items.includes(item));
  const mistakes=missing.length+extra.length;
  const rating=expired?1:Math.max(1,5-mistakes);
  const base=expired?0:Math.round(order.price*Math.max(0.25,1-mistakes*.25)*100)/100;
  const tip=!expired&&mistakes===0?Math.round(order.price*(.1+remaining/patienceLimit()*.15+activeUpgrades().tips*.05)*100)/100:0;
  const streakBonus=recordPerfectResult(!expired && !mistakes);
  if(!expired&&!mistakes)state.dayWins++;
  if(!expired&&remaining>=patienceLimit()/2)state.dayFast++;
  if(!expired&&!mistakes&&order.vip)state.dayVip++;
  state.earnings=Math.round((state.earnings+base+tip+streakBonus)*100)/100;
  const localSale=base+tip+streakBonus;
  if(automated)state.networkIncome=Math.round((state.networkIncome+localSale)*100)/100;
  state.storeTickets[state.currentStore]++;
  if(state.currentStore===0){state.homeIncome=Math.round((state.homeIncome+localSale)*100)/100;state.homeSold+=expired?0:1;}
  else{const branch=state.branches[state.currentStore-1];branch.income=Math.round((branch.income+localSale)*100)/100;branch.sold+=expired?0:1;}
  const challengeReward=checkChallenge();state.sold+=expired?0:1;state.completed++;state.ratingCount++;state.ratingTotal+=rating;
  if(expired){$('activity').textContent=`${order.name} had to leave. No sale this time. Try the next order!`;}
  else if(!mistakes){$('activity').textContent=`Perfect pizza! ${order.name} paid ${money(base)} + ${money(tip)} tip${streakBonus?` + ${money(streakBonus)} streak bonus`:""}.`;}
  else{$('activity').textContent=`${order.name} picked up their pizza. Sale: ${money(base)}. Next order!`;}
  if(automated)$('activity').textContent=`Your crew served ${order.name}. +${money(localSale)}`;
  const message=$('activity').textContent;addLog(message);playSound(expired?'soft':'sale');
  stats();newOrder();save();showToast(challengeReward?`Daily challenge complete! +${money(challengeReward)} bonus`:expired?'Next customer is ready':`Sale complete · +${money(base+tip+streakBonus)}`);
}
let pendingImport=null;
let toastTimeout=null;
function shopName(){return 'Corner Slice';}
function isPaused(){return startScreenOpen || paused || document.hidden || !!document.querySelector('dialog[open]');}
function openDialog(id){$(id).showModal();controls();patience();}
function renderPause(){
  $('pause-overlay').hidden=!paused;
  $('pause-button').textContent=paused?'▶ Resume':'Ⅱ Pause';
  $('pause-button').setAttribute('aria-pressed',String(paused));controls();patience();
}
function showToast(message){
  $('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>$('toast').hidden=true,3200);
}
function addLog(message){state.history.unshift(message);state.history=state.history.slice(0,5);renderLog();}
function renderLog(){
  $('recent-sales').replaceChildren(...state.history.slice(0,3).map(message=>{const li=document.createElement('li');li.textContent=message;return li;}));
  $('history-empty').hidden=state.history.length>0;
}
function currentEvent(){return state.day>=6?dayEvents[(state.day-6)%dayEvents.length]:null;}
function eventReward(){return 30+Math.floor((state.day-6)/5)*10;}
function challengeProgress(){
  const event=currentEvent();return event?.id==='rush'?state.dayFast:event?.id==='critic'?state.dayVip:state.dayWins;
}
function checkChallenge(){
  const event=currentEvent();if(!event||state.challengePaid||challengeProgress()<event.target)return 0;
  const reward=eventReward();state.challengePaid=true;state.challengesWon++;
  state.earnings=Math.round((state.earnings+reward)*100)/100;
  addLog(`${event.name} challenge completed. ${money(reward)} bonus!`);return reward;
}
function renderEvent(){
  const event=currentEvent();$('day-event').hidden=!event;$('late-game-preview').hidden=!!event;
  if(!event)return;
  $('event-icon').textContent=event.icon;$('event-name').textContent=event.name;$('event-detail').textContent=event.detail;
  $('event-goal').textContent=event.goal;$('event-progress').textContent=state.challengePaid?`Complete · +${money(eventReward())}`:`${Math.min(challengeProgress(),event.target)} / ${event.target} · ${money(eventReward())} bonus`;
  $('event-progress').classList.toggle('rewarded',state.challengePaid);
  $('event-day').textContent=`DAY ${state.day} SPECIAL`;
}
function orderForDay(store=state.currentStore,ticket=state.storeTickets[store]){
  if(state.day===1&&store===0)return orders[ticket%orders.length];
  const seed=(Math.floor(state.seed)+state.day*7919+ticket*104729+store*15485863)>>>0;
  const base=orders[seed%orders.length];
  const event=currentEvent();
  if(!event && (state.day<3||ticket%2===0))return base;
  const pool=event?.id==='market'?['mushroom','basil','olive','pepper','onion','corn']:ingredients.slice(2);
  const count=event?.id==='festival'?4+seed%2:event?.id==='rush'?2:2+seed%3;
  const extras=Array.from({length:Math.min(count,pool.length)},(_,i)=>pool[(seed+i*(pool.length===6?1:3))%pool.length]);
  const items=event?.id==='white'?['cheese',...extras]:['sauce','cheese',...extras];
  const vip=event?.id==='critic'&&ticket%10===4;
  const multiplier=vip?2:event?.id==='market'?1.35:event?.id==='rush'?1.25:event?.id==='white'?1.3:event?.id==='festival'?1.4:1;
  return {...base,name:vip?'The food critic':base.name,avatar:vip?'🧐':base.avatar,vip,
    description:vip?'A very special guest':event?event.name:'Ordering a house special',
    quote:`${vip?'I’m here to try your signature pizza. ':''}${event?.id==='white'?'A white pizza with mozzarella, no tomato sauce, and':'My combo today: tomato sauce, mozzarella, and'} ${extras.map(item=>names[item].toLowerCase()).join(', ')}. Thank you!`,
    items,price:Math.round((10+extras.length*2)*multiplier*100)/100};
}
function achievements(){return [
  {icon:'🍕',title:'First slice',detail:'Sell your first pizza.',unlocked:state.sold>=1},
  {icon:'✦',title:'On a roll',detail:'Serve 3 perfect pizzas in a row.',unlocked:state.bestStreak>=3},
  {icon:'☀',title:'Open for business',detail:'Reach day 3.',unlocked:state.day>=3},
  {icon:'♨',title:'Local favourite',detail:'Sell 20 pizzas.',unlocked:state.sold>=20},
  {icon:'♛',title:'Pizza empire',detail:'Earn $500 in total.',unlocked:state.earnings>=500},
  {icon:'🏪',title:'A second home',detail:'Buy your first additional store.',unlocked:state.branches.length>=1},
  {icon:'🤝',title:'You’re hired',detail:'Hire your first worker.',unlocked:state.primaryWorkers+state.branches.reduce((sum,branch)=>sum+branch.workers,0)>=1},
  {icon:'⚡',title:'Challenge accepted',detail:'Complete 3 daily special challenges.',unlocked:state.challengesWon>=3},
  {icon:'🏙️',title:'Across the city',detail:'Own all 5 additional stores.',unlocked:state.branches.length>=5},
  {icon:'💼',title:'Big business',detail:'Earn $1,000 from your staffed stores.',unlocked:state.networkIncome>=1000}
];}
function renderAchievements(){
  $('achievement-list').replaceChildren(...achievements().map(badge=>{
    const row=document.createElement('div');row.className=`achievement ${badge.unlocked?'unlocked':''}`;
    const icon=document.createElement('span');icon.textContent=badge.icon;
    const text=document.createElement('div');const title=document.createElement('strong');title.textContent=badge.title;
    const detail=document.createElement('small');detail.textContent=badge.detail;text.append(title,detail);
    const mark=document.createElement('b');mark.textContent=badge.unlocked?'✓':'○';row.append(icon,text,mark);return row;
  }));
}
function renderUpgrades(){
  $('equipment-shop-name').textContent=locationName(state.currentStore);
  $('upgrade-wallet').textContent=money(wallet());
  $('upgrade-list').replaceChildren(...Object.entries(upgrades).map(([key,upgrade])=>{
    const level=activeUpgrades()[key];const card=document.createElement('div');card.className='upgrade-card';
    const icon=document.createElement('span');icon.className='upgrade-icon';icon.textContent=upgrade.icon;
    const text=document.createElement('div');const title=document.createElement('strong');title.textContent=upgrade.title;
    const detail=document.createElement('p');detail.textContent=upgrade.description;
    const progress=document.createElement('small');progress.textContent=`Level ${level} / ${upgrade.max}`;text.append(title,detail,progress);
    const buy=document.createElement('button');buy.className='outline-button';buy.textContent=level>=upgrade.max?'Maxed out':state.day<upgrade.unlock[level]?`Day ${upgrade.unlock[level]}`:money(upgrade.costs[level]);
    buy.disabled=level>=upgrade.max||wallet()<upgrade.costs[level]||baking||state.day<upgrade.unlock[level];
    buy.addEventListener('click',()=>purchaseUpgrade(key));card.append(icon,text,buy);return card;
  }));
  $('upgrade-note').textContent=baking?'Finish baking before upgrading your shop.':'Equipment upgrades belong to the shop you’re currently running.';
}
function purchaseUpgrade(key){
  const upgrade=upgrades[key];if(!upgrade||baking)return false;
  const level=activeUpgrades()[key],cost=upgrade.costs[level];
  if(level>=upgrade.max||wallet()<cost||state.day<upgrade.unlock[level])return false;
  state.spent=Math.round((state.spent+cost)*100)/100;activeUpgrades()[key]++;
  if(key==='seating')remaining+=5;
  save();stats();patience();renderUpgrades();playSound('ready');showToast(`${upgrade.title} upgraded!`);return true;
}
function checkVictory(){
  if(state.victorySeen||state.branches.length!==5||Array.from({length:6},(_,store)=>staffAt(store)).some(count=>count<3))return;
  state.victorySeen=true;addLog('City conquered! All six shops are owned and fully staffed.');save();openDialog('victory-dialog');
}
function locationName(store){return store===0?shopName():branchLocations[store-1]?.name||'Unassigned';}
function syncStaff(){
  state.primaryWorkers=staffAt(0);state.branches.forEach((branch,index)=>branch.workers=staffAt(index+1));
}
function networkRate(){
  return Array.from({length:state.branches.length+1},(_,store)=>{
    const staff=staffAt(store);return staff?14*10/(Math.max(2,6-staff)+Math.ceil(storeBakeTicks(store)/10)+2):0;
  }).reduce((sum,value)=>sum+value,0);
}
function setView(view){
  if(!['kitchen','map','crew','journal'].includes(view))return;
  gameView=view;
  ['kitchen','map','crew','journal'].forEach(name=>{
    $(`${name}-view`).hidden=name!==view;$(`nav-${name}`).setAttribute('aria-pressed',String(name===view));
  });
  $('screen-name').textContent={kitchen:'KITCHEN',map:'CITY MAP',crew:'CREW',journal:'QUEST LOG'}[view];
  if(view==='map')renderMap();if(view==='crew')renderCrew();if(view==='journal')renderLog();controls();patience();
}
let mapCardLive=[];
function refreshMapActivity(){
  for(const entry of mapCardLive){
    const {store,info,details}=entry;
    if(store>state.branches.length)continue;
    info.textContent=cityWorkStatus(store);
    const income=store===0?state.homeIncome:state.branches[store-1].income;
    const sold=store===0?state.homeSold:state.branches[store-1].sold;
    details.children[0].textContent=`${staffAt(store)} / 3 crew`;
    details.children[1].textContent=`${sold} sold`;
    details.children[2].textContent=`${money(income)} earned`;
  }
}
function cityWorkStatus(store){
  if(shiftClosed())return 'Closed until 8 AM';
  if(!staffAt(store))return 'Hire crew to automate';
  if(store===state.currentStore&&!state.autoEnabled[store])return 'Player is running the kitchen';
  const pizza=store===state.currentStore?{baking,baked}:state.kitchens[store];
  return pizza?.baked?'Serving a customer':pizza?.baking?'Baking fresh pizzas':'Preparing the next order';
}
function renderMap(){
  mapCardLive=[];
  $('city-stores').replaceChildren(...Array.from({length:6},(_,store)=>{
    const owned=store<=state.branches.length;const location=store===0?{name:locationName(store),icon:'🍕',cost:0,day:1}:{...branchLocations[store-1],name:locationName(store)};
    const card=document.createElement('button');card.className=`city-store city-store-${store}${owned?' owned':''}${state.currentStore===store?' selected-store':''}`;
    card.setAttribute('aria-label',owned?`Visit ${location.name}`:`View ${location.name}`);
    card.setAttribute('aria-current',String(owned&&state.currentStore===store));
    const top=document.createElement('div');top.className='map-card-top';
    const art=document.createElement('span');art.className='map-building';art.textContent=location.icon;
    const badge=document.createElement('span');badge.className='map-card-badge';badge.textContent=owned?state.currentStore===store?'Current kitchen':'Owned':state.day<location.day?`Day ${location.day}`:store-1===state.branches.length?'Next expansion':'Future location';top.append(art,badge);
    const name=document.createElement('strong');name.textContent=location.name;
    const info=document.createElement('small');info.className='map-card-status';info.textContent=owned?cityWorkStatus(store):state.day<location.day?`Opens for purchase on day ${location.day}`:store-1===state.branches.length?'Ready to add to your empire':'Buy the previous location first';
    const details=document.createElement('div');details.className='map-card-details';
    if(owned){
      const income=store===0?state.homeIncome:state.branches[store-1].income;const sold=store===0?state.homeSold:state.branches[store-1].sold;
      for(const text of [`${staffAt(store)} / 3 crew`,`${sold} sold`,`${money(income)} earned`]){const item=document.createElement('span');item.textContent=text;details.append(item);}
    }else{const price=document.createElement('span');price.textContent=`${money(location.cost)} to open`;details.append(price);}
    const action=document.createElement('span');action.className='map-card-action';action.textContent=owned?'Visit kitchen →':state.day>=location.day&&store-1===state.branches.length&&wallet()>=location.cost?'Expand here →':'View location →';
    card.append(top,name,info,details,action);
    if(owned)mapCardLive.push({store,info,details});
    card.addEventListener('click',()=>{
      if(owned)changeStore(store);
      else{renderBusiness();openDialog('business-dialog');}
    });return card;
  }));
  $('map-summary').textContent=`${state.branches.length+1} / 6 stores · ${state.team.length} crew · ${formatTime(state.clockMinutes)} · Shops close at 6 PM`;
}
function renderCrew(){
  $('crew-list').replaceChildren(...state.team.map(worker=>{
    const card=document.createElement('div');card.className='crew-card';
    const avatar=document.createElement('span');avatar.className='crew-avatar';avatar.textContent=worker.avatar;
    const detail=document.createElement('div');const name=document.createElement('strong');name.textContent=worker.name;
    const role=document.createElement('small');role.textContent=worker.store<0?'On the bench':shiftClosed()?'Off duty':worker.store===state.currentStore&&!state.autoEnabled[worker.store]?'Manual kitchen · waiting':'Making and selling pizzas';detail.append(name,role);
    const label=document.createElement('label');label.textContent='WORKS AT';
    const select=document.createElement('select');select.setAttribute('aria-label',`Assign ${worker.name} to a shop`);
    for(let store=-1;store<=state.branches.length;store++){
      const option=document.createElement('option');option.value=String(store);option.textContent=store<0?'Bench (unassigned)':locationName(store);
      option.disabled=store>=0&&store!==worker.store&&staffAt(store)>=3;select.append(option);
    }
    select.value=String(worker.store);select.addEventListener('change',()=>assignWorker(worker.id,Number(select.value)));label.append(select);card.append(avatar,detail,label);return card;
  }));
  $('crew-empty').hidden=state.team.length>0;$('crew-summary').textContent=`${state.team.length} / 18 hired · ${state.team.filter(worker=>worker.store<0).length} on the bench`;
}
function assignWorker(id,store){
  const worker=state.team.find(person=>person.id===id);
  if(!worker||!Number.isInteger(store)||store< -1||store>state.branches.length||worker.store===store)return false;
  if(store>=0&&staffAt(store)>=3)return false;
  if(baking&&(worker.store===state.currentStore||store===state.currentStore)){showToast('Finish this bake before changing the kitchen team.');renderCrew();return false;}
  worker.store=store;syncStaff();save();stats();renderCrew();renderMap();renderBusiness();showToast(`${worker.name} assigned to ${store<0?'the bench':locationName(store)}`);return true;
}
function renderBusiness(){
  $('business-wallet').textContent=money(wallet());$('business-rate').textContent=`${state.team.filter(worker=>worker.store>=0).length} workers cooking across ${state.branches.length+1} shops · ${formatTime(state.clockMinutes)}`;
  $('business-list').replaceChildren();
  for(let store=0;store<=branchLocations.length;store++){
    const branch=store===0?null:state.branches[store-1];const location=store===0?{name:locationName(store),icon:'🍕',cost:0,day:1}:{...branchLocations[store-1],name:locationName(store)};
    const owned=store===0||!!branch;const card=document.createElement('div');card.className=`business-card ${owned?'owned-business':''}`;
    const title=document.createElement('strong');title.textContent=`${location.icon} ${location.name}${state.currentStore===store?' · Active':''}`;
    const detail=document.createElement('p');detail.textContent=owned?`${staffAt(store)} / 3 crew · ${money(store===0?state.homeIncome:branch.income)} earned here. Crew automatically prepare, bake, and serve pizzas here from 8 AM to 6 PM.`:`Unlocks day ${location.day}. Purchase to open a new playable kitchen.`;
    const actions=document.createElement('div');actions.className='store-actions';
    const action=document.createElement('button');action.className='outline-button';
    if(owned){
      const costs=store===0?assistantCosts:hiringCosts;const count=staffAt(store);
      action.textContent=count>=3?'Fully staffed':`Hire · ${money(costs[count])}`;
      action.disabled=count>=3||state.team.length>=18||wallet()<costs[count]||(baking&&store===state.currentStore);
      action.addEventListener('click',()=>hireWorker(store===0?'home':store-1));
      const visit=document.createElement('button');visit.className='outline-button';visit.textContent=state.currentStore===store?'Current shop':'Visit kitchen';
      visit.addEventListener('click',()=>{changeStore(store);$('business-dialog').close();});actions.append(visit);
    }else{
      action.textContent=state.day<location.day?`Day ${location.day}`:`Buy · ${money(location.cost)}`;
      action.disabled=store-1!==state.branches.length||state.day<location.day||wallet()<location.cost;
      action.addEventListener('click',()=>buyStore(store-1));
    }
    actions.append(action);card.append(title,detail,actions);$('business-list').append(card);
  }
}
function buyStore(index){
  const location=branchLocations[index];if(!location||index!==state.branches.length||state.day<location.day||wallet()<location.cost)return false;
  state.spent=Math.round((state.spent+location.cost)*100)/100;state.branches.push({workers:0,income:0,sold:0,upgrades:{oven:0,seating:0,tips:0}});
  addLog(`${location.name} unlocked. A new kitchen is ready!`);save();stats();renderBusiness();renderMap();showToast(`New store unlocked: ${location.name}`);return true;
}
function hireWorker(store){
  const target=store==='home'?0:Number.isInteger(store)?store+1:-1;
  if(target<0||target>state.branches.length||state.team.length>=18||staffAt(target)>=3||(baking&&target===state.currentStore))return false;
  const costs=target===0?assistantCosts:hiringCosts;const cost=costs[staffAt(target)];if(wallet()<cost)return false;
  state.spent=Math.round((state.spent+cost)*100)/100;
  const id=state.nextWorker++;const worker={id:`crew-${id}`,name:crewNames[(id-1)%crewNames.length],avatar:crewAvatars[(id-1)%crewAvatars.length],store:target};
  state.team.push(worker);syncStaff();addLog(`${worker.name} joined ${locationName(target)}.`);
  save();stats();renderBusiness();renderCrew();renderMap();showToast(`${worker.name} joined your crew!`);return true;
}
function storeUpgrades(store){return store===0?state.upgrades:state.branches[store-1].upgrades;}
function storeBakeTicks(store){return Math.max(6,30-storeUpgrades(store).oven*6-staffAt(store)*2);}
function shiftClosed(){return state.clockMinutes>=CLOSE_TIME;}
function formatTime(minutes){const wholeMinutes=Math.floor(minutes);const hour=Math.floor(wholeMinutes/60);return `${hour%12||12}:${String(wholeMinutes%60).padStart(2,'0')} ${hour>=12?'PM':'AM'}`;}
function crewInControl(){return !shiftClosed()&&staffAt(state.currentStore)>0&&state.autoEnabled[state.currentStore];}
function renderAutomation(){
  const staff=staffAt(state.currentStore);const automatic=crewInControl();
  $('automation-button').disabled=!staff||shiftClosed();$('automation-button').textContent=automatic?'Take control':'Let crew run this shop';
  $('automation-button').setAttribute('aria-pressed',String(automatic));
  $('automation-status').textContent=shiftClosed()?'Crew off duty until 8 AM':automatic?baking?'Crew is baking pizzas':baked?'Crew is serving the customer':`Crew is preparing orders · ${staff} workers`:staff?'You’re running this kitchen':'Hire a worker to cook and sell automatically';
  controls();
}
function creditWorkerSale(store,pizza){
  const recipe=pizza.order;const chosen=new Set(pizza.selected);
  const mistakes=recipe.items.filter(item=>!chosen.has(item)).length+[...chosen].filter(item=>!recipe.items.includes(item)).length;
  const base=Math.round(recipe.price*Math.max(.25,1-mistakes*.25)*100)/100;
  const tip=mistakes?0:Math.round(recipe.price*(.2+storeUpgrades(store).tips*.05)*100)/100;
  const streakBonus=recordPerfectResult(!mistakes);
  const amount=Math.round((base+tip+streakBonus)*100)/100;
  state.earnings=Math.round((state.earnings+amount)*100)/100;state.networkIncome=Math.round((state.networkIncome+amount)*100)/100;
  state.sold++;state.completed++;state.storeTickets[store]++;state.ratingCount++;state.ratingTotal+=Math.max(1,5-mistakes);
  if(!mistakes){state.dayWins++;state.dayFast++;if(recipe.vip)state.dayVip++;}
  if(store===0){state.homeIncome=Math.round((state.homeIncome+amount)*100)/100;state.homeSold++;}
  else{const branch=state.branches[store-1];branch.income=Math.round((branch.income+amount)*100)/100;branch.sold++;}
  addLog(`${locationName(store)} crew served a pizza. +${money(amount)}`);checkChallenge();
}
function runWorkerKitchen(store){
  const staff=staffAt(store);if(!staff||shiftClosed())return;
  if(store===state.currentStore){
    if(!crewInControl()||!order)return;
    if(baked){finishOrder(false,true);return;}
    if(baking)return;
    crewProgress++;
    if(crewProgress>=Math.max(2,6-staff)){
      selected=new Set(order.items);renderPizza();startOven();
    }
    renderAutomation();return;
  }
  let pizza=state.kitchens[store];
  if(!pizza||!pizza.order){
    pizza={selected:[],baked:false,baking:false,remaining:75,started:false,ovenTicks:0,crewProgress:0,order:orderForDay(store)};
    state.kitchens[store]=pizza;
  }
  if(pizza.baked){creditWorkerSale(store,pizza);state.kitchens[store]=null;return;}
  if(pizza.baking){
    pizza.ovenTicks=(Number.isFinite(pizza.ovenTicks)?pizza.ovenTicks:0)+10;
    if(pizza.ovenTicks>=storeBakeTicks(store)){pizza.baking=false;pizza.baked=true;}
    return;
  }
  pizza.crewProgress=(Number.isFinite(pizza.crewProgress)?pizza.crewProgress:0)+1;
  if(pizza.crewProgress>=Math.max(2,6-staff)){
    pizza.selected=[...pizza.order.items];pizza.baking=true;pizza.ovenTicks=0;
  }
}
function closeShift(){
  if(!shiftClosed())return;
  clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;
  state.kitchens=Array(6).fill(null);newOrder();stats();save();
  addLog(`Day ${state.day} closed at 6 PM. ${state.completed} customers served.`);if(gameView==='crew')renderCrew();save();showToast('6 PM · Shops closed! Your daily summary is ready.');
}
function networkTick(){
  if(isPaused()||shiftClosed())return;
  for(let store=0;store<=state.branches.length;store++)runWorkerKitchen(store);
  stats();save();
}
function clockTick(){
  if(isPaused()||shiftClosed())return;
  state.clockMinutes=Math.min(CLOSE_TIME,state.clockMinutes+1);
  if(shiftClosed())closeShift();else{stats();save();}
}
function openNextDay(){
  if(!shiftClosed())return false;
  state.day++;state.clockMinutes=OPEN_TIME;state.completed=0;state.dayStart=state.earnings;state.kitchens=Array(6).fill(null);state.storeTickets=Array(6).fill(0);
  state.dayWins=0;state.dayFast=0;state.dayVip=0;state.challengePaid=false;
  stats();newOrder();save();if(gameView==='crew')renderCrew();$('activity').textContent='8 AM · Shops open. Your crew is ready to work.';return true;
}
function validateBackup(backup){
  if(backup?.format!=='slice-society-backup'||backup.version!==1||!Array.isArray(backup.saves?.slots)||backup.saves.slots.length!==3||backup.saves.slots.some(slot=>slot!==null&&(!slot||!validState(slot.state))))throw new Error('Choose a Slice Society save backup.');
  return {
    active:Number.isInteger(backup.saves.active)&&backup.saves.active>=0&&backup.saves.active<3?backup.saves.active:0,
    slots:backup.saves.slots.map((slot,index)=>slot?{...slot,state:normalizeState(slot.state),saveName:saveFileName(slot,index),name:'Corner Slice'}:null)
  };
}
function restoreBackup(backup){
  clearInterval(timer);clearInterval(ovenTimer);timer=null;ovenTimer=null;
  saves=backup;loadSlot();saveMenu();
}
function playSound(kind){
  if(!soundEnabled)return;
  try{
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    audioContext ||= new Audio();audioContext.resume();
    const notes=kind==='sale'?[523,659,784]:kind==='ready'?[659,880]:kind==='oven'?[220]:[330];
    notes.forEach((frequency,index)=>{
      const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),time=audioContext.currentTime+index*.09;
      oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.07,time);gain.gain.exponentialRampToValueAtTime(.001,time+.15);
      oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(time);oscillator.stop(time+.16);
    });
  }catch{}
}
document.querySelectorAll('[data-ingredient]').forEach(button=>button.addEventListener('click',()=>{
  if(baking||baked||serving||!order||isPaused())return;const ingredient=button.dataset.ingredient;selected.has(ingredient)?selected.delete(ingredient):selected.add(ingredient);startTimer();renderPizza();save();
}));
$('clear-button').addEventListener('click',()=>{if(!serving&&order&&!isPaused()){clearPizza();save();}});
function startOven(ticks=0){
  baking=true;ovenTicks=ticks;startTimer();playSound('oven');renderPizza();$('bake-overlay').hidden=false;
  $('bake-progress').style.width=`${ovenTicks/bakeTicks()*100}%`;
  ovenTimer=setInterval(()=>{
    if(isPaused())return;ovenTicks++;$('bake-progress').style.width=`${ovenTicks/bakeTicks()*100}%`;
    if(ovenTicks>=bakeTicks()){clearInterval(ovenTimer);ovenTimer=null;baking=false;baked=true;$('bake-overlay').hidden=true;renderPizza();save();playSound('ready');showToast('Fresh from the oven. Ready to serve.');}
  },100);
}
$('bake-button').addEventListener('click',()=>{
  if(!selected.size||baking||baked||!order||isPaused())return;startOven();save();
});
$('serve-button').addEventListener('click',()=>{if(baked&&!baking&&!isPaused())finishOrder();});
$('next-day').addEventListener('click',openNextDay);
$('automation-button').addEventListener('click',()=>{
  if(!staffAt(state.currentStore)||shiftClosed())return;state.autoEnabled[state.currentStore]=!state.autoEnabled[state.currentStore];crewProgress=0;renderAutomation();save();
});
$('help-button').addEventListener('click',()=>openDialog('help-dialog'));
$('start-help-button').addEventListener('click',()=>openDialog('help-dialog'));
$('start-button').addEventListener('click',startGame);
$('main-menu-button').addEventListener('click',showStartMenu);
$('start-sound-button').addEventListener('click',()=>{$('sound-button').click();renderStartMenu();});
$('saves-button').addEventListener('click',()=>{save();saveMenu();openDialog('saves-dialog');});
$('reset-button').addEventListener('click',()=>{
  resetAll=false;$('reset-title').textContent='Restart this save?';$('reset-description').textContent=`This clears ${shopName()} and its whole city, including stores and crew. Other saves stay saved.`;$('confirm-reset').textContent='Restart save';openDialog('reset-dialog');
});
$('restart-all-button').addEventListener('click',()=>{
  resetAll=true;$('saves-dialog').close();$('reset-title').textContent='Restart everything?';$('reset-description').textContent='All three save slots will be cleared. You’ll start again on Day 1 at Corner Slice. This cannot be undone.';$('confirm-reset').textContent='Clear all saves & restart';openDialog('reset-dialog');
});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{controls();patience();}));
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
$('confirm-reset').addEventListener('click',()=>{restartShop(resetAll);$('reset-dialog').close();});
$('confirm-delete').addEventListener('click',()=>{deleteSlot(pendingDelete);pendingDelete=null;$('delete-dialog').close();});
$('delete-dialog').addEventListener('close',()=>{pendingDelete=null;});
$('pause-button').addEventListener('click',()=>{paused=!paused;renderPause();save();});
$('resume-button').addEventListener('click',()=>{paused=false;renderPause();save();});
$('sound-button').addEventListener('click',()=>{soundEnabled=!soundEnabled;$('sound-button').setAttribute('aria-pressed',String(soundEnabled));$('sound-button').textContent=soundEnabled?'♪ Sound on':'♪ Sound off';if(soundEnabled)playSound('ready');});
$('upgrades-button').addEventListener('click',()=>{renderUpgrades();openDialog('upgrades-dialog');});
$('business-button').addEventListener('click',()=>setView('map'));
['kitchen','map','crew','journal'].forEach(view=>$(`nav-${view}`).addEventListener('click',()=>setView(view)));
$('hire-menu-button').addEventListener('click',()=>{renderBusiness();openDialog('business-dialog');});
$('manage-stores-button').addEventListener('click',()=>{renderBusiness();openDialog('business-dialog');});
$('crew-from-map').addEventListener('click',()=>setView('crew'));
$('achievements-button').addEventListener('click',()=>{renderAchievements();openDialog('achievements-dialog');});
$('rename-button').addEventListener('click',()=>{$('save-name-input').value=saveFileName(saves.slots[saves.active],saves.active);openDialog('rename-dialog');});
$('rename-form').addEventListener('submit',event=>{event.preventDefault();const name=$('save-name-input').value.trim().slice(0,28);if(!name)return;save();saves.slots[saves.active].saveName=name;save();saveMenu();$('rename-dialog').close();showToast('Save name updated');});
$('export-button').addEventListener('click',()=>{
  save();const blob=new Blob([JSON.stringify({format:'slice-society-backup',version:1,saves},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='slice-society-saves.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Save backup downloaded');
});
$('import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  try{
    if(file.size>1000000)throw new Error('This file is too large.');
    const backup=JSON.parse(await file.text());
    pendingImport=validateBackup(backup);$('import-description').textContent='Restore this backup? It will replace all three current save slots.';openDialog('import-dialog');
  }catch(error){showToast(error.message||'Could not read this backup.');}
});
$('confirm-import').addEventListener('click',()=>{
  if(!pendingImport)return;restoreBackup(pendingImport);
  pendingImport=null;$('import-dialog').close();showToast('Backup restored');
});
$('import-dialog').addEventListener('close',()=>{pendingImport=null;});
document.addEventListener('visibilitychange',()=>{renderPause();save();});
document.addEventListener('keydown',event=>{
  if(startScreenOpen)return;
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(event.target.tagName)||document.querySelector('dialog[open]')||gameView!=='kitchen')return;
  const action={b:'bake-button',s:'serve-button',r:'clear-button',p:'pause-button'}[event.key.toLowerCase()];
  if(action&&!$(action).disabled){event.preventDefault();$(action).click();}
});
window.addEventListener('pagehide',save);
renderStartMenu();
setInterval(networkTick,1000);
setInterval(clockTick,1000 / MINUTES_PER_SECOND);
