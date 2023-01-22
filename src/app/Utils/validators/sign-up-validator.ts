import { User } from 'src/app/Models/user';
import { DataProviderService } from './../../Services/data-provider.service';
import {
  catchError,
  debounceTime,
  map,
  of,
  take,
  Observable,
  forkJoin,
  switchMap,
} from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
export class DuplicateUsernameValidator {
  static username(dataProvider: DataProviderService, user: Observable<User>) {
    return (control: AbstractControl) => {
      return user.pipe(
        switchMap((user) => dataProvider.getUser(user.id)),
        take(1),
        debounceTime(500),
        catchError((err) => {
          if (err.status === HttpStatusCode.NotFound) {
            return of(null);
          }
        }),
        map((data) => (!!data ? { usernameAvailable: false } : null))
      );
    };
  }
}
