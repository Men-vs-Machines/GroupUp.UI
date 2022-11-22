import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  user$: Observable<User>;
  wishListForm = this.fb.group({
    items: this.fb.array([])
  });

  get items() {
    return this.wishListForm.get('items');
  }

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user$ = this.authService.user$;

    this.patch();
  }

  patch() {
    this.user$.subscribe(user => {
      console.log(user);
      this.wishListForm.patchValue({
        items: user.wishList
      });
    });
  }
}
