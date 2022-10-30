import { IMappedStore, MappedStore } from ".";

export interface IMappedListStore<T> extends IMappedStore<T[]> {
  getSubItem(key: string, matcher: (item: T) => boolean): T | undefined;
}

export class MappedListStore<T>
  extends MappedStore<T[]>
  implements IMappedListStore<T>
{
  getSubItem(key: string, matcher: (item: T) => boolean): T | undefined {
    if (!this.has(key)) {
      return undefined;
    }
    const list = this.get(key);
    for (let i = 0; i < list.length; i++) {
      if (matcher(list[i])) {
        return list[i];
      }
    }
    return undefined;
  }
}
