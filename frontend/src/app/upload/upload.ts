import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrService } from '../services/ocr';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class UploadComponent {
  selectedFile: File | null = null;
  readonly ocrService = inject(OcrService);

  handleFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  process(): void {
    if (this.selectedFile) {
      this.ocrService.uploadFile(this.selectedFile);
    }
  }
}
