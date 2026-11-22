'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.IQComparisons=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 function valid(value,version){
  if(!value||value.timing_method!=='histogram'||value.version!==1||value.puzzle_version!==version||!Number.isSafeInteger(value.sample_size)||value.sample_size<0||!Number.isSafeInteger(value.minimum_sample)||value.minimum_sample<30||!Number.isInteger(value.period_days)||value.period_days<1||value.period_days>366||!Array.isArray(value.questions)||value.questions.length>36)return null;
  const seen=new Set(),questions=[];
  for(const q of value.questions){if(!q||!Number.isInteger(q.question)||q.question<1||q.question>36||seen.has(q.question)||![q.answered,q.correct,q.timed_correct].every(n=>Number.isSafeInteger(n)&&n>=0)||q.correct>q.answered||q.timed_correct>q.correct||q.answered>value.sample_size||!((q.median_lower_ms===null&&q.median_upper_ms===null)||(Number.isSafeInteger(q.median_lower_ms)&&Number.isSafeInteger(q.median_upper_ms)&&q.median_lower_ms>=1000&&q.median_upper_ms>q.median_lower_ms&&q.median_upper_ms<=2400000)))return null;seen.add(q.question);questions.push({question:q.question,answered:q.answered,correct:q.correct,timed_correct:q.timed_correct,median_lower_ms:q.timed_correct>=value.minimum_sample?q.median_lower_ms:null,median_upper_ms:q.timed_correct>=value.minimum_sample?q.median_upper_ms:null});}
  return {...value,questions:value.sample_size>=value.minimum_sample?questions:[]};
 }
 function highlight(rows,comparison,iq){
  const eligible=rows.filter(q=>q.status==='correct'&&q.answer_ms>=1000);
  const peers=eligible.map(q=>({own:q,peer:comparison?.questions.find(p=>p.question===q.question)})).filter(q=>q.peer?.answered>=(comparison?.minimum_sample??30)&&q.peer.median_lower_ms!==null&&q.own.answer_ms<=q.peer.median_lower_ms-Math.max(1000,q.peer.median_lower_ms*.1));
  // Prefer an observed difficult correct answer beaten on time; no made-up speed percentile.
  peers.sort((a,b)=>a.peer.correct/a.peer.answered-b.peer.correct/b.peer.answered||a.own.answer_ms/a.peer.median_lower_ms-b.own.answer_ms/b.peer.median_lower_ms);
  if(peers.length&&peers[0].peer.correct/peers[0].peer.answered<=0.5)return {kind:'question',label:'A tricky puzzle, solved quickly',...peers[0]};
  if(iq!==null&&Number(String(iq).replace(/[^\d.]/g,''))>=115)return {kind:'iq',label:'Your estimated IQ',iq};
  if(peers.length)return {kind:'question',label:'Quicker than the typical correct answer',...peers[0]};
  eligible.sort((a,b)=>a.answer_ms-b.answer_ms||a.question-b.question);
  if(eligible.length)return {kind:'question',label:'Your quickest correct answer',own:eligible[0],peer:null};
  const correct=rows.filter(q=>q.status==='correct').length;
  return correct?{kind:'score',label:'Patterns you solved',correct}:{kind:'site',label:'A challenge worth sharing'};
 }
 return Object.freeze({valid,highlight});
});
