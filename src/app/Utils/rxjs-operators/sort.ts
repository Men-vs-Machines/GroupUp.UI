import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

export function sort(sortIdentifier: string) {
  return function<T>(source: Observable<T> ) {
    return source.pipe(map((value: any) => value.sort((a, b) => {
      if (!!a?.sortIdentifier) {
        return a.displayName.localeCompare(b.displayName);
      }
    })));
  }
}