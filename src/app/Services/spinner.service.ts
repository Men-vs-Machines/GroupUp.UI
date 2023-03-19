import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { BehaviorSubject, takeUntil } from 'rxjs';
import { Destroyable } from 'src/app/Utils/destroyable';
import { SpinnnerComponent } from './../Components/spinnner/spinnner.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService extends Destroyable {
  private spinning = new BehaviorSubject<boolean>(false);
  public spinning$ = this.spinning.asObservable();
  private _overlayRef = this.createOverlay();

  constructor(private overlay: Overlay) {
    super();

    this.spinning.pipe(takeUntil(this.destroy$)).subscribe({
      next: (spinning) =>  this.handleSpin(spinning)
    })
  }

  public start() {
    if (this.spinning.value) {
      return;
    }

    this.spinning.next(true);
  }

  public stop() {
    this.spinning.next(false);
    this._overlayRef.detach();
  }

  private createOverlay() {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return this.overlay.create({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    })
  }

  private handleSpin(isSpinning: boolean) {
    if (isSpinning) {
      this._overlayRef.attach(new ComponentPortal(SpinnnerComponent));
    }
  }
}