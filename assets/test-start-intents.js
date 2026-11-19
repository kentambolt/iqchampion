'use strict';

// Internal capture journal only. This file has no network or push adapter.
const test_start_intents = (() => {
  const limit = 32;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const empty = () => ({version:1, mode:'capture', pending:[]});
  function permitted() {
    try {
      const flags = [typeof navigator !== 'undefined' ? navigator.doNotTrack : '1',
        typeof window !== 'undefined' ? window.doNotTrack : undefined];
      return typeof navigator !== 'undefined' && !navigator.globalPrivacyControl
        && !flags.some(value => ['1','yes'].includes(String(value).toLowerCase()));
    } catch { return false; }
  }
  function restore(value) {
    const journal = empty();
    if (value?.version !== 1 || value.mode !== 'capture' || !Array.isArray(value.pending)) return journal;
    for (const event of value.pending) {
      if (journal.pending.length === limit) break;
      if (event?.kind === 'test_started' && typeof event.id === 'string' && uuid.test(event.id)
          && !journal.pending.some(item => item.id === event.id))
        journal.pending.push({id:event.id, kind:'test_started'});
    }
    return journal;
  }
  function record(value) {
    const journal = restore(value);
    if (!permitted() || journal.pending.length === limit) return journal;
    try {
      const id = crypto.randomUUID();
      if (uuid.test(id) && !journal.pending.some(item => item.id === id)) journal.pending.push({id,kind:'test_started'});
    } catch { /* Unsupported crypto must not interrupt the IQ test. */ }
    return journal;
  }
  return Object.freeze({empty,restore,record,permitted});
})();
