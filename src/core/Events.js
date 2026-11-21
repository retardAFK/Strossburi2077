// Bus d'événements : seul canal entre les systèmes (emit / on / off).
export class Events {
  constructor() { this.map = new Map(); }
  on(name, fn) {
    if (!this.map.has(name)) this.map.set(name, new Set());
    this.map.get(name).add(fn);
    return () => this.off(name, fn);
  }
  off(name, fn) { this.map.get(name)?.delete(fn); }
  emit(name, ...args) { for (const fn of [...(this.map.get(name) || [])]) fn(...args); }
  clear() { this.map.clear(); }
}
