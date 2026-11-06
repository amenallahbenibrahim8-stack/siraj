const dhikrOptions=[
  {id:'subhanallah',label:'سبحان الله',target:33},
  {id:'alhamdulillah',label:'الحمد لله',target:33},
  {id:'allahuakbar',label:'الله أكبر',target:34},
  {id:'istighfar',label:'أستغفر الله',target:100},
  {id:'custom',label:'لا إله إلا الله',target:100}
];
const dateKey=()=>{const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`};
const countKey=()=>`siraj-tasbih:${dateKey()}`;
const $=selector=>document.querySelector(selector);
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(countKey())||'{}');
    const selected=dhikrOptions.some(option=>option.id===saved.selected)?saved.selected:dhikrOptions[0].id;
    const count=Number.isSafeInteger(saved.count)&&saved.count>=0?saved.count:0;
    return {selected,count};
  }catch(error){console.error('Unable to read tasbih count',error);return {selected:dhikrOptions[0].id,count:0}}
}
let state=loadState(),toastTimer;
try{document.documentElement.dataset.theme=localStorage.getItem('theme')==='l'?'light':'dark'}catch(error){console.error('Unable to read theme preference',error)}
function currentOption(){return dhikrOptions.find(option=>option.id===state.selected)||dhikrOptions[0]}
function save(){
  try{localStorage.setItem(countKey(),JSON.stringify(state))}
  catch(error){console.error('Unable to save tasbih count',error);$('#message').textContent='تعذّر حفظ العدّاد في هذا المتصفح'}
}
function render(){
  const option=currentOption(),complete=state.count>=option.target;
  $('#dhikr').textContent=option.label;
  $('#count').textContent=state.count.toLocaleString('ar');
  $('#target').textContent=`الهدف: ${option.target.toLocaleString('ar')}`;
  $('#progress').style.width=`${Math.min(state.count/option.target*100,100)}%`;
  $('#progressbar').setAttribute('aria-valuenow',String(Math.min(Math.round(state.count/option.target*100),100)));
  $('#count-button').setAttribute('aria-label',`${option.label}، العدد ${state.count} من ${option.target}. اضغط للعد`);
  $('#message').textContent=complete?'أحسنت، أتممت وردك. يمكنك مواصلة الذكر.':'';
  document.querySelectorAll('[data-dhikr]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.dhikr===state.selected)));
}
function announce(message){$('#message').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{if(state.count<currentOption().target)$('#message').textContent=''},1800)}
$('#options').addEventListener('click',event=>{
  const button=event.target.closest('[data-dhikr]');
  if(!button)return;
  state.selected=button.dataset.dhikr;
  state.count=0;
  save();render();
});
$('#count-button').addEventListener('click',()=>{
  if(state.count<Number.MAX_SAFE_INTEGER)state.count++;
  save();render();navigator.vibrate?.(12);
});
$('#undo').addEventListener('click',()=>{state.count=Math.max(0,state.count-1);save();render()});
$('#reset').addEventListener('click',()=>{state.count=0;save();render();announce('تمت إعادة العدّاد إلى الصفر')});
render();
