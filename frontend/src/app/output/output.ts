import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrService } from '../services/ocr';

@Component({
  selector: 'app-output',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './output.html',
  styleUrl: './output.css',
})
export class OutputComponent {
  readonly ocrService = inject(OcrService);

  downloadJSON(): void {
    const data = JSON.stringify(this.ocrService.jsonOutput(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  copyJSON(button: HTMLButtonElement): void {
    const data = JSON.stringify(this.ocrService.jsonOutput(), null, 2);
    navigator.clipboard.writeText(data).then(() => {
      const originalText = button.innerText;
      button.innerText = 'Copied!';
      setTimeout(() => (button.innerText = originalText), 2000);
    });
  }
}
