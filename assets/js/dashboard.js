const periods=[
  {id:'morning',label:'الصباح',items:[
    ['صلاة الفجر','عبادة'],['أذكار الصباح','ذكر'],['قراءة ورد من القرآن','قرآن'],
    ['شرب الماء','عناية'],['تحديد أهم أولويات اليوم','تنظيم'],['صدقة أو عمل خير','إحسان']
  ]},
  {id:'day',label:'خلال اليوم',items:[
    ['صلاة الظهر','عبادة'],['صلاة العصر','عبادة'],['أذكار بعد الصلاة','ذكر'],
    ['قراءة أو تعلّم شيء نافع','تعلّم'],['صلة رحم أو سؤال عن قريب','صلة'],['مساعدة شخص','إحسان'],
    ['استراحة قصيرة بعيداً عن الشاشة','عناية']
  ]},
  {id:'evening',label:'المساء',items:[
    ['صلاة المغرب','عبادة'],['أذكار المساء','ذكر'],['صلاة العشاء','عبادة'],
    ['مراجعة ما قرأته اليوم','قرآن'],['الامتنان لثلاث نعم','تأمل'],['الاستعداد ليوم الغد','تنظيم'],
    ['دعاء قبل النوم','ذكر']
  ]}
];
const $=selector=>document.querySelector(selector);
const dateKey=()=>{const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`};
const storageKey=()=>`siraj-dashboard:${dateKey()}`;
const load=()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey())||'{}');if(!saved||typeof saved!=='object'||Array.isArray(saved))return {};const validKeys=new Set(periods.flatMap(period=>period.items.map((_,index)=>`${period.id}-${index}`)));return Object.fromEntries(Object.entries(saved).filter(([key,value])=>validKeys.has(key)&&value===true))}catch(error){console.error('Unable to read daily checklist',error);return {}}};
const save=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value))}catch(error){console.error('Unable to save daily checklist',error);toast('تعذّر حفظ التقدم في هذا المتصفح')}};
let active='morning',checks=load(),toastTimer;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
function render(){
  const period=periods.find(item=>item.id===active);
  $('#tabs').innerHTML=periods.map(item=>`<button class="tab" type="button" role="tab" id="tab-${item.id}" aria-selected="${item.id===active}" aria-controls="task-list" data-period="${item.id}">${item.label}</button>`).join('');
  $('#task-list').setAttribute('aria-labelledby',`tab-${active}`);
  $('#task-list').innerHTML=period.items.map((item,index)=>{const key=`${active}-${index}`,done=!!checks[key];return `<button class="task" type="button" data-task="${key}" aria-pressed="${done}"><span class="check" aria-hidden="true">✓</span><span class="task-label">${item[0]}</span><span class="task-tag ${done?'done':''}">${done?'تمت':item[1]}</span></button>`}).join('');
  updateProgress();
}
function updateProgress(){
  const total=periods.reduce((sum,period)=>sum+period.items.length,0);
  const done=Object.values(checks).filter(Boolean).length;
  const percent=total?Math.round(done/total*100):0;
  $('#done-stat').textContent=done.toLocaleString('ar');
  $('#left-stat').textContent=(total-done).toLocaleString('ar');
  $('#percent').textContent=`${percent.toLocaleString('ar')}٪`;
  $('#ring').style.setProperty('--progress',`${percent}%`);
  $('#ring').setAttribute('aria-valuenow',String(percent));
}
$('#tabs').addEventListener('click',event=>{const tab=event.target.closest('[data-period]');if(tab){active=tab.dataset.period;render()}});
$('#task-list').addEventListener('click',event=>{const task=event.target.closest('[data-task]');if(!task)return;const key=task.dataset.task;checks[key]=!checks[key];save(checks);render()});
$('#reset').addEventListener('click',()=>{checks={};save(checks);render();toast('تمت إعادة تعيين قائمة اليوم')});
$('#theme').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('theme',next==='light'?'l':'d')}catch(error){console.error('Unable to save theme preference',error)}});
try{document.documentElement.dataset.theme=localStorage.getItem('theme')==='l'?'light':'dark'}catch(error){console.error('Unable to read theme preference',error)}
const hour=new Date().getHours();
$('#welcome').textContent=hour<12?'صباح الخير':hour<18?'نهارك سعيد':'مساء الخير';
$('#today').textContent=new Intl.DateTimeFormat('ar-TN',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date());
render();
