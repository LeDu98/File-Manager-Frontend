import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'primeng/api';

export interface IUploadFileInfo {
  file: File;
  name: string;
  size: number;
}

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.html',
  styleUrls: ['./upload-dialog.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ProgressBarModule, MessageModule, TooltipModule, SharedModule]
})
export class UploadDialogComponent {
  @Input() parentId: string | null = null;
  @Output() filesUploaded = new EventEmitter<{ files: File[]; parentId: string | null }>();

  showDialog = false;
  selectedFiles: File[] = [];
  uploading = false;
  uploadProgress = 0;
  errorMessage = '';

  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.txt'];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  showUploadDialog(parentId: string | null = null) {
    this.parentId = parentId;
    this.selectedFiles = [];
    this.uploading = false;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.showDialog = true;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.validateAndAddFiles(files);
    }
    input.value = '';
  }

  private validateAndAddFiles(files: File[]) {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const fileExtension = this.getFileExtension(file.name).toLowerCase();
      if (!this.allowedExtensions.includes(fileExtension)) {
        errors.push(`${file.name}: File type not allowed. Only JPG, PNG, and TXT files are supported.`);
        continue;
      }

      if (file.size > this.maxFileSize) {
        errors.push(`${file.name}: File size exceeds 10MB limit.`);
        continue;
      }

      if (this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name}: File already selected.`);
        continue;
      }

      validFiles.push(file);
    }

    this.selectedFiles = [...this.selectedFiles, ...validFiles];

    if (errors.length > 0) {
      this.errorMessage = errors.join('\n');
    } else {
      this.errorMessage = '';
    }
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.errorMessage = '';
  }

  upload() {
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';

    this.simulateUpload();
  }

  private simulateUpload() {
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.uploading = false;
        
        this.filesUploaded.emit({
          files: [...this.selectedFiles],
          parentId: this.parentId
        });
        
        this.closeDialog();
      }
    }, 200);
  }

  cancel() {
    if (this.uploading) {
      this.uploading = false;
      this.uploadProgress = 0;
    }
    this.closeDialog();
  }

  private closeDialog() {
    this.showDialog = false;
    setTimeout(() => {
      this.selectedFiles = [];
      this.uploading = false;
      this.uploadProgress = 0;
      this.errorMessage = '';
      this.parentId = null;
    }, 100);
  }

  onDialogHide() {
    this.closeDialog();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
