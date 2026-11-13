import {mkdir,writeFile} from 'node:fs/promises';
const id='414e4d9d57e68120bd24e9d96062b590';
const token=process.env.NOTION_TOKEN;
if(!token)throw Error('Missing NOTION_TOKEN repository secret');
async function api(path){
  for(let i=0;i<5;i++){
    const r=await fetch('https://api.notion.com/v1'+path,{headers:{Authorization:'Bearer '+token,'Notion-Version':'2022-06-28'}});
    if((r.status===429||r.status>=500)&&i<4){await new Promise(ok=>setTimeout(ok,1000*(i+1)));continue}
    if(!r.ok)throw Error('Notion API HTTP '+r.status+'; check integration and page access');
    return await r.json();
  }
}
async function blocks(parent){
  let cursor,items=[];
  do{
    const q=new URLSearchParams({page_size:'100'});
    if(cursor)q.set('start_cursor',cursor);
    const data=await api('/blocks/'+parent+'/children?'+q.toString());
    items.push(...data.results);
    cursor=data.has_more?data.next_cursor:undefined;
    if(data.has_more&&!cursor)throw Error('Notion pagination failed');
  }while(cursor);
  return items;
}
const esc=s=>String(s||'').replace(/([\\*_{}\[\]])/g,'\\$1');
function rich(arr=[]){
  return arr.map(p=>{
    if(p.type==='equation')return '$'+(p.equation?.expression||'')+'$';
    let s=esc(p.plain_text||p.text?.content||'');
    if(p.annotations?.code)s=String.fromCharCode(96)+s+String.fromCharCode(96);
    if(p.annotations?.bold)s='**'+s+'**';
    if(p.annotations?.italic)s='*'+s+'*';
    if(p.annotations?.strikethrough)s='~~'+s+'~~';
    const url=p.href||p.text?.link?.url;
    if(url)s='['+s+']('+encodeURI(url).replace(/\(/g,'%28').replace(/\)/g,'%29')+')';
    return s;
  }).join('').replace(/\n/g,'  \n');
}
async function render(items,depth=0){
  if(depth>8)return ['> 过深的嵌套内容请在 Notion 原页面查看'];
  const lines=[];
  for(const b of items){
    const t=b.type,d=b[t]||{},s=rich(d.rich_text);
    let line='';
    if(t.startsWith('heading_'))line='#'.repeat(Number(t.slice(-1))+1)+' '+s;
    else if(t==='paragraph')line=s;
    else if(t==='quote'||t==='callout')line='> '+(d.icon?.emoji||'')+' '+s;
    else if(t==='bulleted_list_item')line='- '+s;
    else if(t==='numbered_list_item')line='1. '+s;
    else if(t==='to_do')line='- ['+(d.checked?'x':' ')+'] '+s;
    else if(t==='toggle')line='**'+s+'**';
    else if(t==='code')line=String.fromCharCode(96).repeat(3)+(d.language||'')+'\n'+(d.rich_text||[]).map(x=>x.plain_text||'').join('')+'\n'+String.fromCharCode(96).repeat(3);
    else if(t==='divider')line='---';
    else if(t==='equation')line='$$\n'+d.expression+'\n$$';
    else if(t==='bookmark'||t==='embed')line='['+esc(d.url||'链接')+']('+d.url+')';
    else if(t==='image'||t==='file'||t==='pdf'||t==='video'){
      const url=d.external?.url;
      const cap=rich(d.caption)||t;
      line=url?(t==='image'?'!['+cap+']('+url+')':'['+cap+']('+url+')'):'*Notion 附件请在原页面查看*';
    }else if(t==='table'){
      const rows=(await blocks(b.id)).filter(x=>x.type==='table_row').map(x=>(x.table_row?.cells||[]).map(rich));
      if(rows.length){
        const width=Math.max(...rows.map(x=>x.length));
        lines.push('| '+Array.from({length:width},(_,i)=>(rows[0][i]||'').replace(/\|/g,'\\|')).join(' | ')+' |');
        lines.push('| '+Array(width).fill('---').join(' | ')+' |');
        for(const row of rows.slice(1))lines.push('| '+Array.from({length:width},(_,i)=>(row[i]||'').replace(/\|/g,'\\|')).join(' | ')+' |');
      }
    }else if(t==='child_page')line='**子页面：'+esc(d.title)+'（请打开 Notion 查看）**';
    else if(t==='link_to_page')line='[关联页面](https://www.notion.so/'+(d.page_id||d.database_id||'')+')';
    else if(!['column','column_list','synced_block','table_of_contents'].includes(t))line='> 未支持的区块：'+esc(t);
    if(line)lines.push(line,'');
    if(b.has_children&&!['table','child_page'].includes(t)){
      const sub=await render(await blocks(b.id),depth+1);
      if(['bulleted_list_item','numbered_list_item','to_do'].includes(t))lines.push(...sub.map(x=>x?'  '+x:x));
      else lines.push(...sub);
    }
  }
  return lines;
}
const page=await api('/pages/'+id);
const top=await blocks(id);
if(!top.length)throw Error('Empty page: refusing to publish');
const title=rich(page.properties?.title?.title)||'ROS 2 导航与 VLN';
const contents=(await render(top)).join('\n');
const output=['<!-- GENERATED FILE: DO NOT EDIT MANUALLY -->','# '+title,'','> 从 [Notion 原页面](https://juniper-selenium-d99.notion.site/414e4d9d57e68120bd24e9d96062b590) 自动同步。','',contents].join('\n').trim()+'\n';
if(output.length<500)throw Error('Output too short: refusing to overwrite');
await mkdir('docs/notion-sync',{recursive:true});
await writeFile('docs/notion-sync/ros2-vln.md',output);
console.log('Exported '+top.length+' top-level blocks ('+output.length+' characters).');
