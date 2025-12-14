import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'app-feedback-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feedback-wrapper" *ngIf="feedbackService.message$ | async as toast">
      <div class="feedback" [class.success]="toast.type === 'success'"
           [class.error]="toast.type === 'error'" [class.info]="toast.type === 'info'">
        <span>{{ toast.message }}</span>
        <button type="button" (click)="feedbackService.clear()" aria-label="Close">&times;</button>
      </div>
    </div>
  `,
  styleUrl: './feedback-toast.css'
})
export class FeedbackToast {
  constructor(public feedbackService: FeedbackService) {}
}
