'use strict';
// Transport stays disabled until the separate central IQ contract and staging are verified.
const iq_statistics_config = Object.freeze({enabled:false});
let iq_comparison_data = null;
let iq_share_choice = null;
function result_rows() { return IQAttemptStatistics.rows(answers,Array.from({length:36},(_,i)=>get_hash(i+1,1,true)),attempt_measurement?.snapshot()); }
function stats_time(ms) { return ms===null||!Number.isFinite(ms)?'—':Math.max(0,Math.round(ms/1000))+' s'; }
function stats_copy_text(highlight) {
 const da=i18n.language==='da',site='https://iqchampion.com/'+i18n.language+'/';
 if(highlight.kind==='iq')return (da?'Min estimerede IQ i IQ Champion: ':'My estimated IQ in IQ Champion: ')+highlight.iq+(da?'. Kun for sjov. Prøv selv: ':'. Just for fun. Try it: ')+site;
 if(highlight.kind==='question')return (da?'Jeg løste opgave ':'I solved question ')+highlight.own.question+(da?' korrekt på ':' correctly in ')+stats_time(highlight.own.answer_ms)+(highlight.peer?(da?' (medianen blandt korrekte svar: ':' (median among correct answers: ')+stats_time(highlight.peer.median_correct_ms)+')':'')+(da?'. Kan du også? ':'. Can you do it too? ')+site;
 if(highlight.kind==='score')return (da?'Jeg fandt ':'I found ')+highlight.correct+(da?' rigtige mønstre i IQ Champion. Prøv selv: ':' correct patterns in IQ Champion. Try it: ')+site;
 return (da?'Kan du finde de manglende mønstre i IQ Champion? ':'Can you find the missing patterns in IQ Champion? ')+site;
}
function render_result_statistics() {
 if(!finished||started_at===null)return;
 const rows=result_rows(),summary=IQAttemptStatistics.summary(rows),iq=answered_count()===36?estimate_iq(calculate_score(answers,reference_scores).percentile):null;
 const highlight=IQComparisons.highlight(rows,iq_comparison_data,iq);
 const target=iq_share_choice==='score'&&summary.correct>0?{kind:'score',label:'Patterns you solved',correct:summary.correct}:iq_share_choice==='iq'&&iq!==null?{kind:'iq',label:'Your estimated IQ',iq}:highlight;
 i18n.text(document.getElementById('highlight-label'),target.label);
 i18n.text(document.getElementById('highlight-value'),target.kind==='question'?`Question ${target.own.question} · ${stats_time(target.own.answer_ms)}`:target.kind==='iq'?String(target.iq):target.kind==='score'?`${target.correct} correct patterns`:'36 puzzles. One challenge.');
 let note='Share a challenge with someone you know.';
 if(target.kind==='question')note=target.peer?`Correct-answer median: ${stats_time(target.peer.median_correct_ms)} (${target.peer.timed_correct} timed correct answers).`:'Your own active time. There is not enough comparison data to rank its speed.';
 if(target.kind==='iq')note='Just for fun. An approximate score, not a professionally validated IQ measurement.';
 i18n.text(document.getElementById('highlight-note'),note);
 const url='https://iqchampion.com/'+(target.kind==='iq'?'share/'+i18n.language+'/'+summary.correct+'/':target.kind==='question'?'share/'+i18n.language+'/question/'+target.own.question+'/':target.kind==='score'?'share/'+i18n.language+'/patterns/'+target.correct+'/':i18n.language+'/');
 document.getElementById('highlight-facebook').setAttribute('href','https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url));
 document.getElementById('share-copy-text').value=stats_copy_text(target);
 document.getElementById('share-iq-choice').hidden=iq===null;
 document.getElementById('share-score-choice').hidden=summary.correct===0;
 i18n.text(document.getElementById('stats-total-time'),`Active time: ${stats_time(summary.active_ms)}`);
 i18n.text(document.getElementById('stats-comparison-note'),iq_comparison_data?`Comparison: ${iq_comparison_data.sample_size} voluntary attempts over ${iq_comparison_data.period_days} days.`:'Question comparisons are not available yet. Your personal statistics are shown below.');
 const body=document.getElementById('statistics-rows');body.replaceChildren();
 for(const row of rows){const tr=document.createElement('tr');const first=document.createElement('th');first.setAttribute('scope','row');const button=document.createElement('button');button.type='button';button.className='stats-review question-link';button.textContent=String(row.question);i18n.attribute(button,'aria-label',`Review question ${row.question} / 36`);button.addEventListener('click',()=>show_answer_review(row.question));first.append(button);tr.append(first);
 const status=document.createElement('td');status.className='stats-status '+row.status;i18n.text(status,{correct:'Correct',incorrect:'Incorrect',unanswered:'Unanswered'}[row.status]);tr.append(status);
 const time=document.createElement('td');time.textContent=stats_time(row.status==='unanswered'?row.active_ms:row.answer_ms);tr.append(time);
 const peer=iq_comparison_data?.questions.find(q=>q.question===row.question);const median=document.createElement('td');median.textContent=peer?.median_correct_ms!=null?stats_time(peer.median_correct_ms)+' (n='+peer.timed_correct+')':'—';tr.append(median);
 const rate=document.createElement('td');rate.textContent=peer && peer.answered>=iq_comparison_data.minimum_sample?Math.round(100*peer.correct/peer.answered)+'% (n='+peer.answered+')':'—';tr.append(rate);body.append(tr);}
 document.getElementById('contribution-form').hidden=!iq_statistics_config.enabled;
 document.getElementById('contribution-pending').hidden=iq_statistics_config.enabled;
}
document.getElementById('share-best-choice').addEventListener('click',()=>{iq_share_choice=null;render_result_statistics();});
document.getElementById('share-iq-choice').addEventListener('click',()=>{iq_share_choice='iq';render_result_statistics();});
document.getElementById('share-score-choice').addEventListener('click',()=>{iq_share_choice='score';render_result_statistics();});
document.getElementById('copy-highlight').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('share-copy-text').value);i18n.text(document.getElementById('copy-status'),'Copied. Paste it into your post.');}catch{i18n.text(document.getElementById('copy-status'),'Select and copy the text below.');}});
