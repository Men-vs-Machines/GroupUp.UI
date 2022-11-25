import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { map, Observable, tap, take, takeUntil, finalize, switchMap } from 'rxjs';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { UserService } from 'src/app/Services/user.service';
import { Destroyable } from 'src/app/Utils/destroyable';
import {z} from 'zod';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent extends Destroyable {
  user$: Observable<User>;
  wishListForm = this.fb.group({
    items: this.fb.array([])
  });

  wishListSaving = false;

  get items() {
    return this.wishListForm.controls['items'] as FormArray;
  }

  constructor(private authService: AuthService, private fb: FormBuilder, private dataProvider: DataProviderService, private userService: UserService) {
    super();
  } 

  ngOnInit(): void {
    this.user$ = this.userService.user$;
    this.user$.pipe(
      map(({wishList}) => wishList.map(item => this.fb.control({value: item, disabled: true}))),
      takeUntil(this.destroy$)
    )
    .subscribe(data => this.wishListForm.setControl('items', this.fb.array(data)));
  }

  addWishListItem() {
    this.items.push(this.fb.control(''));
  }

  enableForm(index) {
    this.items.controls[index].enable();
  }

  disableForm(index) {
    this.items.controls[index].disable();
  }

  removeWishlistItem(index) {
    this.items.removeAt(index);
  }

  saveWishList() {
    this.wishListSaving = true;
    this.user$.pipe(
      tap(user => user.wishList = this.wishListForm.getRawValue().items),
      switchMap(user => this.dataProvider.updateUser(user)),
      finalize(() => this.wishListSaving = false),
      take(1))
    .subscribe({
      next: () => this.items.disable()
    })
  }

  trackByFn(index, item) {
    return item;
  }
}
