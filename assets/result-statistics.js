'use strict';
// Transport stays disabled until the separate central IQ contract and staging are verified.
const iq_statistics_config = Object.freeze({enabled:false});
let iq_comparison_data = null;
const iq_statistics_api=IQStatisticsTransport.create(iq_statistics_config);
let iq_comparison_key=null;

let iq_share_choice = null;
function result_rows() { return IQAttemptStatistics.rows(answers,Array.from({length:36},(_,i)=>get_hash(i+1,1,true)),attempt_measurement?.snapshot()); }
function stats_time(ms) { return ms===null||!Number.isFinite(ms)?'—':Math.max(0,Math.round(ms/1000))+' s'; }
function stats_median(peer) { return stats_time(peer.median_lower_ms)+'–'+stats_time(peer.median_upper_ms); }
function stats_copy_text(highlight) {
 const da=i18n.language==='da',site='https://iqchampion.com/'+i18n.language+'/';
 if(highlight.kind==='iq')return (da?'Min estimerede IQ i IQ Champion: ':'My estimated IQ in IQ Champion: ')+highlight.iq+(da?'. Kun for sjov. Prøv selv: ':'. Just for fun. Try it: ')+site;
 if(highlight.kind==='question')return (da?'Jeg løste opgave ':'I solved question ')+highlight.own.question+(da?' korrekt på ':' correctly in ')+stats_time(highlight.own.answer_ms)+(highlight.peer?(da?' (estimeret median blandt korrekte svar: ':' (estimated median among correct answers: ')+stats_median(highlight.peer)+')':'')+(da?'. Kan du også? ':'. Can you do it too? ')+site;
 if(highlight.kind==='score')return (da?'Jeg fandt ':'I found ')+highlight.correct+(da?' rigtige mønstre i IQ Champion. Prøv selv: ':' correct patterns in IQ Champion. Try it: ')+site;
 return (da?'Kan du finde de manglende mønstre i IQ Champion? ':'Can you find the missing patterns in IQ Champion? ')+site;
}
function render_result_statistics() {
 if(!finished||started_at===null)return;
 const rows=result_rows(),summary=IQAttemptStatistics.summary(rows),iq=answered_count()===36?estimate_iq(calculate_score(answers,reference_scores).percentile):null;
 const highlight=IQComparisons.highlight(rows,iq_comparison_data,iq);
 const target=iq_share_choice==='question'?IQComparisons.highlight(rows,iq_comparison_data,null):iq_share_choice==='score'&&summary.correct>0?{kind:'score',label:'Patterns you solved',correct:summary.correct}:iq_share_choice==='iq'&&iq!==null?{kind:'iq',label:'Your estimated IQ',iq}:highlight;
 i18n.text(document.getElementById('highlight-title'),target.kind==='site'?'Share the challenge':'Your strongest moment');
 i18n.text(document.getElementById('highlight-label'),target.label);
 i18n.text(document.getElementById('highlight-value'),target.kind==='question'?`Question ${target.own.question} · ${stats_time(target.own.answer_ms)}`:target.kind==='iq'?String(target.iq):target.kind==='score'?`${target.correct} correct patterns`:'36 puzzles. One challenge.');
 let note='Share a challenge with someone you know.';
 if(target.kind==='question')note=target.peer?`Estimated median range: ${stats_median(target.peer)} (${target.peer.timed_correct} timed correct answers).`:'Your own active time. There is not enough comparison data to rank its speed.';
 if(target.kind==='iq')note='Just for fun. An approximate score, not a professionally validated IQ measurement.';
 i18n.text(document.getElementById('highlight-note'),note);
 const url='https://iqchampion.com/'+(target.kind==='iq'?'share/'+i18n.language+'/'+summary.correct+'/':target.kind==='question'?'share/'+i18n.language+'/question/'+target.own.question+'/':target.kind==='score'?'share/'+i18n.language+'/patterns/'+target.correct+'/':i18n.language+'/');
 document.getElementById('highlight-facebook').setAttribute('href','https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url));
 document.getElementById('share-copy-text').value=stats_copy_text(target);
 document.getElementById('share-iq-choice').hidden=iq===null;
 document.getElementById('share-question-choice').hidden=!rows.some(q=>q.status==='correct'&&q.answer_ms>=1000);
 i18n.text(document.getElementById('stats-cohort-label'),'All voluntary attempts');
 document.getElementById('share-score-choice').hidden=summary.correct===0;
 render_contribution_state();
 i18n.text(document.getElementById('stats-total-time'),`Active time: ${stats_time(summary.active_ms)}`);
 i18n.text(document.getElementById('stats-comparison-note'),iq_comparison_data?`Comparison: ${iq_comparison_data.sample_size} voluntary attempts over ${iq_comparison_data.period_days} days.`:'Question comparisons are not available yet. Your personal statistics are shown below.');
 const body=document.getElementById('statistics-rows');body.replaceChildren();
 for(const row of rows){const tr=document.createElement('tr');const first=document.createElement('th');first.setAttribute('scope','row');const button=document.createElement('button');button.type='button';button.className='stats-review question-link';button.textContent=String(row.question);i18n.attribute(button,'aria-label',`Review question ${row.question} / 36`);button.addEventListener('click',()=>show_answer_review(row.question));first.append(button);tr.append(first);
 const status=document.createElement('td');status.className='stats-status '+row.status;i18n.text(status,{correct:'Correct',incorrect:'Incorrect',unanswered:'Unanswered'}[row.status]);tr.append(status);
 const time=document.createElement('td');time.textContent=stats_time(row.status==='unanswered'?row.active_ms:row.answer_ms);tr.append(time);
 const peer=iq_comparison_data?.questions.find(q=>q.question===row.question);const median=document.createElement('td');median.textContent=peer?.median_lower_ms!=null?stats_median(peer)+' (n='+peer.timed_correct+')':'—';tr.append(median);
 const rate=document.createElement('td');rate.textContent=peer && peer.answered>=iq_comparison_data.minimum_sample?Math.round(100*peer.correct/peer.answered)+'% (n='+peer.answered+')':'—';tr.append(rate);body.append(tr);}
 document.getElementById('contribution-form').hidden=!iq_statistics_api.allowed();
 document.getElementById('contribution-pending').hidden=iq_statistics_api.allowed();
 if(iq_statistics_config.enabled&&!iq_statistics_api.allowed()) i18n.text(document.getElementById('contribution-pending'),'Your browser privacy preferences keep these statistics on your device.');
}
document.getElementById('share-best-choice').addEventListener('click',()=>{iq_share_choice=null;render_result_statistics();});
document.getElementById('share-iq-choice').addEventListener('click',()=>{iq_share_choice='iq';render_result_statistics();});
document.getElementById('share-question-choice').addEventListener('click',()=>{iq_share_choice='question';render_result_statistics();});
document.getElementById('share-score-choice').addEventListener('click',()=>{iq_share_choice='score';render_result_statistics();});
document.getElementById('copy-highlight').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('share-copy-text').value);i18n.text(document.getElementById('copy-status'),'Copied. Paste it into your post.');}catch{i18n.text(document.getElementById('copy-status'),'Select and copy the text below.');}});

function selected_demographics(){return {age_group:document.getElementById('stats-age').value||null,country:document.getElementById('stats-country').value||null};}
function render_contribution_state(){
 const select=document.getElementById('stats-country');
 if(iq_statistics_config.enabled&&select.dataset?.language!==i18n.language){const current=select.value||'';select.replaceChildren();const blank=document.createElement('option');blank.value='';blank.textContent=i18n.translate('Prefer not to say');select.append(blank);let names;try{names=new Intl.DisplayNames([i18n.language],{type:'region'});}catch{}
 const countries=IQStatisticsTransport.COUNTRIES.map(code=>({code,name:names?names.of(code):code})).sort((a,b)=>a.name.localeCompare(b.name,i18n.language));for(const c of countries){const option=document.createElement('option');option.value=c.code;option.textContent=c.name;select.append(option);}select.value=current;select.dataset.language=i18n.language;}
 const saved=statistics_contribution&&IQStatisticsTransport.validate(statistics_contribution.payload)?statistics_contribution:null;
 const locked=!!saved;document.getElementById('stats-age').disabled=locked;select.disabled=locked;
 if(saved){document.getElementById('stats-age').value=saved.payload.demographics.age_group||'';select.value=saved.payload.demographics.country||'';}
 document.getElementById('contribute-statistics').disabled=saved?.status==='accepted';
 if(saved?.status==='accepted')i18n.text(document.getElementById('contribution-status'),'Thank you. Your anonymous contribution was saved.');
}
async function refresh_iq_comparisons(){
 if(!iq_statistics_config.enabled||!finished||started_at===null)return;
 const id=statistics_id,version=puzzle_version,key=String(version);iq_comparison_key=key;
 const result=await iq_statistics_api.read(version);
 if(statistics_id!==id||!finished||puzzle_version!==version||iq_comparison_key!==key)return;
 iq_comparison_data=result.status==='ready'?result.data:null;render_result_statistics();
 if(result.status==='ready'&&result.data.sample_size<result.data.minimum_sample)i18n.text(document.getElementById('stats-comparison-note'),'There are not enough comparable attempts in this group yet. Your own statistics are always available.');
 else if(result.status!=='ready')i18n.text(document.getElementById('stats-comparison-note'),'Comparisons are temporarily unavailable. Your own statistics and sharing still work.');
}
document.getElementById('contribution-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!iq_statistics_api.allowed())return;
 if(!finished||started_at===null||!statistics_id||!attempt_measurement){i18n.text(document.getElementById('contribution-status'),'This older attempt has no complete timing record. You can still explore and share your result.');return;}
 const consent=!!document.getElementById('stats-consent').checked;
 if(!consent){i18n.text(document.getElementById('contribution-status'),'Choose whether to contribute before sending any data.');return;}
 const existing=statistics_contribution&&IQStatisticsTransport.validate(statistics_contribution.payload)?statistics_contribution:null;
 const candidate=existing?.payload||{version:1,id:statistics_id,puzzle_version,completion:timed_out?'timeout':'finished',elapsed_ms:Math.max(0,Math.min(2400000,finished_at-started_at)),questions:result_rows().map(q=>({question:q.question,status:q.status,active_ms:q.active_ms,answer_ms:q.answer_ms,changes:q.changes})),demographics:selected_demographics()};
 const payload=IQStatisticsTransport.validate(candidate);
 if(!payload){i18n.text(document.getElementById('contribution-status'),'This attempt has no complete timing record. Your personal results are unchanged.');return;}
 const id=statistics_id;statistics_contribution={payload,status:'pending'};
 if(!save_attempt()){i18n.text(document.getElementById('contribution-status'),'Your contribution could not be saved in this browser. Nothing was sent.');return;}
 render_contribution_state();document.getElementById('contribute-statistics').disabled=true;
 const result=await iq_statistics_api.contribute(payload,consent);
 if(statistics_id!==id||!finished)return;
 if(result.status==='accepted'){statistics_contribution={payload,status:'accepted'};save_attempt();render_contribution_state();void refresh_iq_comparisons();}
 else {document.getElementById('contribute-statistics').disabled=false;i18n.text(document.getElementById('contribution-status'),result.status==='conflict'||result.status==='rejected'?'This contribution needs review and was not counted again.':'Your contribution has not been confirmed. Try again with the same saved contribution.');}
});
