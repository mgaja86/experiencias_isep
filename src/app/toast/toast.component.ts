import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  @Input() show = false;
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }

  get icon() {
    if (this.type === 'success') return '✓';
    if (this.type === 'error') return '✕';
    return 'ℹ';
  }
}