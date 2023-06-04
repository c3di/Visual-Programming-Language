export interface IUniqueNamePool {
  createNew: (prefix?: string) => string;
  add: (item: string) => boolean;
  addRef: (name: string, item: any) => void;
  removeRef: (name: string, item: any) => void;
  remove: (item: string) => void;
  itemRef: (name: string) => any[];
  all: () => string[];
  allRef: () => Record<string, string[]>;
}

export default class UnqiueNamePool implements IUniqueNamePool {
  private readonly _pool: string[] = [];
  private readonly _itemRef: Record<string, string[]> = {};

  all(): string[] {
    return this._pool;
  }

  allRef(): Record<string, string[]> {
    return this._itemRef;
  }

  createNew(prefix?: string): string {
    let counter = 0;
    const namePrefix = prefix ?? 'item';
    let name = `${namePrefix}_${counter}`;
    while (this._pool.includes(name)) {
      counter++;
      name = `${namePrefix}_${counter}`;
    }
    return name;
  }

  add(newName: string): boolean {
    if (!this._pool.includes(newName)) {
      this._pool.push(newName);
      if (!this._itemRef[newName]) this._itemRef[newName] = [];
      return true;
    }
    return false;
  }

  addRef(name: string, ref: any): void {
    if (!this._itemRef[name]) this._itemRef[name] = [];
    if (!this._itemRef[name].includes(ref)) {
      this._itemRef[name].push(ref);
    }
  }

  remove(item: string): void {
    const index = this._pool.indexOf(item);
    if (index > -1) {
      this._pool.splice(index, 1);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._itemRef[item];
    }
  }

  removeRef(name: string, item: any): void {
    if (this._itemRef[name]) {
      const index = this._itemRef[name].indexOf(item);
      if (index > -1) {
        this._itemRef[name].splice(index, 1);
      }
    }
  }

  itemRef(name: string): any[] {
    return this._itemRef[name] || [];
  }
}
