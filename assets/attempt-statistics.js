'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.IQAttemptStatistics=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const LIMIT=2400000;
 const empty=()=>Array.from({length:36},()=>({active_ms:0,answer_ms:null,visits:0,changes:0}));
 function restore(value){
  if(!value||value.version!==1||!Array.isArray(value.questions)||value.questions.length!==36)return null;
  const questions=[];let total=0;
  for(const q of value.questions){if(!q||!Number.isSafeInteger(q.active_ms)||q.active_ms<0||q.active_ms>LIMIT||!(q.answer_ms===null||(Number.isSafeInteger(q.answer_ms)&&q.answer_ms>=0&&q.answer_ms<=q.active_ms))||!Number.isSafeInteger(q.visits)||q.visits<0||q.visits>10000||!Number.isSafeInteger(q.changes)||q.changes<0||q.changes>10000)return null;total+=q.active_ms;questions.push({active_ms:q.active_ms,answer_ms:q.answer_ms,visits:q.visits,changes:q.changes});}
  return total<=LIMIT?{version:1,questions}:null;
 }
 function create(options={}){
  const now=options.now||Date.now;let state=restore(options.saved)||{version:1,questions:empty()};let question=0,visible=options.visible!==false,at=null;
  function tick(){const next=now();if(at!==null&&visible&&question){const total=state.questions.reduce((s,q)=>s+q.active_ms,0);state.questions[question-1].active_ms+=Math.min(Math.max(0,Math.round(next-at)),Math.max(0,LIMIT-total));}at=visible&&question?next:null;}
  function open(id){if(!Number.isInteger(id)||id<1||id>36)return;tick();if(id!==question)state.questions[id-1].visits++;question=id;at=visible?now():null;}
  function visibility(value){tick();visible=!!value;at=visible&&question?now():null;}
  function answer(id){if(id!==question)return;tick();const row=state.questions[id-1];row.answer_ms=row.active_ms;row.changes++;}
  function finish(){tick();question=0;at=null;}
  function snapshot(){tick();return {version:1,questions:state.questions.map(q=>({...q}))};}
  return Object.freeze({open,visibility,answer,finish,snapshot});
 }
 function rows(answers,correct,saved){const valid=restore(saved);return Array.from({length:36},(_,i)=>({question:i+1,status:answers[i]==null?'unanswered':answers[i]===correct[i]?'correct':'incorrect',active_ms:valid?valid.questions[i].active_ms:null,answer_ms:answers[i]!=null&&valid?valid.questions[i].answer_ms:null,changes:valid?valid.questions[i].changes:null}));}
 function summary(rows){return {correct:rows.filter(r=>r.status==='correct').length,incorrect:rows.filter(r=>r.status==='incorrect').length,unanswered:rows.filter(r=>r.status==='unanswered').length,active_ms:rows.some(r=>r.active_ms!==null)?rows.reduce((s,r)=>s+(r.active_ms||0),0):null};}
 return Object.freeze({create,restore,rows,summary,LIMIT});
});
