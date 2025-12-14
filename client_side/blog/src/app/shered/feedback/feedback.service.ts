import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FeedbackType = 'success' | 'error' | 'info';

export interface FeedbackMessage {
  message: string;
  type: FeedbackType;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private messageSubject = new BehaviorSubject<FeedbackMessage | null>(null);
  readonly message$ = this.messageSubject.asObservable();
  private hideTimeout?: any;

  show(message: string, type: FeedbackType = 'info', duration = 3500) {
    this.messageSubject.next({ message, type });
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => this.clear(), duration);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error', 5000);
  }

  info(message: string) {
    this.show(message, 'info');
  }

  clear() {
    this.messageSubject.next(null);
  }
}
