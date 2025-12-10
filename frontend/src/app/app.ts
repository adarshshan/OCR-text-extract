import { Component } from '@angular/core';
import { UploadComponent } from './upload/upload';
import { OutputComponent } from './output/output';
import { OcrService } from './services/ocr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UploadComponent, OutputComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [OcrService],
})
export class AppComponent {}
