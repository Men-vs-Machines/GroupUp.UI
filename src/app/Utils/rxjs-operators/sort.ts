import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

export function sort() {
  return function<T>(source: Observable<T>) {
    return source.pipe(map((value: any) => value.sort((a, b) => a.displayName.localeCompare(b.displayName))));
  }
}