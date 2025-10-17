import { ChangeDetectionStrategy, ChangeDetectorRef, Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastComponent } from '../toast/toast.component';

const WEBHOOK_URL = 'https://workflow.universidadisep.com/webhook/comparte_tu_experiencia';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './upload-photo.component.html',
  styleUrl: './upload-photo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadPhotoComponent {
  file: File | null = null;
  previewUrl: string | null = null;
  userName: WritableSignal<string> = signal('');
  programName: WritableSignal<string> = signal('');

  isDragging: WritableSignal<boolean> = signal(false);
  isUploading: WritableSignal<boolean> = signal(false);
  progress: WritableSignal<number> = signal(0);

  toastVisible: WritableSignal<boolean> = signal(false);
  toastMessage: WritableSignal<string> = signal('');
  toastType: WritableSignal<'success' | 'error' | 'info'> = signal('info');

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.setFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const dt = event.dataTransfer;
    const file = dt && dt.files && dt.files[0] ? dt.files[0] : null;
    this.setFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  private setFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.showToast('Por favor selecciona una imagen válida.', 'error');
      return;
    }
    this.file = file;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = URL.createObjectURL(file);
    this.cdr.markForCheck();
  }

  removeFile() {
    this.file = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.progress.set(0);
    this.userName.set('');
    this.programName.set('');
    this.cdr.markForCheck();
  }

  upload() {
    if (!this.file || !this.userName().trim() || !this.programName().trim()) {
      this.showToast('Por favor, completa todos los campos y selecciona una foto.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    formData.append('name', this.userName().trim());
    formData.append('program', this.programName().trim());

    this.isUploading.set(true);
    this.progress.set(0);

    this.http.post(WEBHOOK_URL, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: HttpEvent<unknown>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
          this.progress.set(percent);
          this.cdr.markForCheck();
        } else if (event.type === HttpEventType.Response) {
          this.isUploading.set(false);
          this.progress.set(100);
          this.showToast('¡Tu foto se ha enviado con éxito! 🎉', 'success');
          setTimeout(() => {
            this.removeFile();
            this.cdr.markForCheck();
          }, 600);
        }
      },
      error: () => {
        this.isUploading.set(false);
        this.showToast('No se pudo enviar la foto. Si el problema persiste, puede ser una restricción de CORS del servidor.', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible.set(true);
    setTimeout(() => {
      this.toastVisible.set(false);
      this.cdr.markForCheck();
    }, 3500);
  }

  onToastClosed() {
    this.toastVisible.set(false);
  }
}