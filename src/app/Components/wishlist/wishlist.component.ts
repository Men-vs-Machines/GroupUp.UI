import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  user$: Observable<User>;
  wishListForm: FormGroup;

  get items() {
    return this.wishListForm.controls['items'] as FormArray;
  }

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user$ = this.authService.user$;
    this.user$.subscribe(user => {
      this.items.clear();
      user.wishList.forEach(item => {
        this.items.push(this.fb.group({
          value: item,
        }));
      });
    });
  }

  addWishListItem() {
    let items = this.wishListForm.get('items') as FormArray;
    items.push(this.fb.control({value: '', disabled: false}));
    console.log(this.wishListForm.getRawValue());
  }

  enableForm(index) {
    this.items.controls[index].enable();
  }

  disableForm(index) {
    this.items.controls[index].disable();
  }

  removeWishListItem(index) {
    this.items.removeAt(index);
  }

  saveWishList() {
    console.log(this.wishListForm.getRawValue());
  }

  trackByFn(index, item) {
    return index;
  }
}
