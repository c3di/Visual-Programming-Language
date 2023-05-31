export interface IUniqueNamePool {
  createNew: (prefix?: string) => string;
  add: (item: string) => void;
  addRef: (name: string, item: any) => void;
  remove: (item: string) => void;
  itemRef: (name: string) => any[];
  onRemove?: (item: string) => void;
  onAdd?: (item: string) => void;
}

export default class UnqiueNamePool implements IUniqueNamePool {
  private readonly _pool: string[] = [];
  private readonly _itemRef: Record<string, any[]> = {};
  public onAdd?: (item: string) => void;
  public onRemove?: (item: string) => void;
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

  add(newName: string): void {
    if (!this._pool.includes(newName)) {
      this._pool.push(newName);
      this._itemRef[newName] = [];
      this.onAdd?.(newName);
    }
  }

  addRef(name: string, ref: any): void {
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
      this.onRemove?.(item);
    }
  }

  itemRef(name: string): any[] {
    return this._itemRef[name] || [];
  }
}
