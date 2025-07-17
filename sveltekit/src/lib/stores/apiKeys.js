import { writable } from 'svelte/store';

const defaultKeys = { mapbox: '', openweather: '', esri: '', opentopo: '' };

function createStore() {
  let stored;
  if (typeof localStorage !== 'undefined') {
    stored = localStorage.getItem('apiKeys');
  }
  const initial = stored ? JSON.parse(stored) : defaultKeys;
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set(keys) {
      set(keys);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('apiKeys', JSON.stringify(keys));
      }
    },
    update(fn) {
      update(current => {
        const next = fn(current);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('apiKeys', JSON.stringify(next));
        }
        return next;
      });
    }
  };
}

export const apiKeys = createStore();
