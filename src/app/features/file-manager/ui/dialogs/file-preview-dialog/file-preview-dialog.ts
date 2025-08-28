import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SharedModule } from 'primeng/api';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FilesApiService } from '../../../data/file-manager.api.services';
import { IFileManagerItem } from '../../../models';

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.html',
  styleUrls: ['./file-preview-dialog.scss'],
  standalone: true,
  imports: [CommonModule, Dialog, Button, ProgressSpinner, SharedModule]
})
export class FilePreviewDialogComponent implements OnDestroy {
  showDialog = false;
  loading = false;
  error: string | null = null;
  
  fileItem: IFileManagerItem | null = null;
  fileContent: string | SafeUrl | null = null;
  contentType: string | null = null;
  fileType: 'image' | 'text' | 'unsupported' = 'unsupported';
  
  private subscription?: Subscription;

  constructor(
    private filesApiService: FilesApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  showPreview(item: IFileManagerItem) {
    this.fileItem = item;
    this.showDialog = true;
    this.loading = true;
    this.error = null;
    this.fileContent = null;
    this.contentType = null;

    this.fileType = this.determineFileType(item.name);

    if (this.fileType === 'unsupported') {
      this.loading = false;
      this.error = 'File type not supported for preview';
      return;
    }

    this.loadFileContent(item.id);
  }

  private determineFileType(fileName: string): 'image' | 'text' | 'unsupported' {
    const extension = fileName.toLowerCase().split('.').pop() || '';
    
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const textExtensions = ['txt'];

    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (textExtensions.includes(extension)) {
      return 'text';
    }

    return 'unsupported';
  }

  private loadFileContent(fileId: string) {
    this.subscription?.unsubscribe();
    
    this.subscription = this.filesApiService.getFileContent(fileId).subscribe({
      next: (response) => {
        this.contentType = response.contentType;
        
        if (this.fileType === 'image') {
          const blob = new Blob([response.data], { type: response.contentType });
          this.fileContent = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        } else if (this.fileType === 'text') {
          const decoder = new TextDecoder('utf-8');
          this.fileContent = decoder.decode(response.data);
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading file content:', error);
        this.error = 'Failed to load file content';
        this.loading = false;
      }
    });
  }

  closeDialog() {
    if (this.fileContent && this.fileType === 'image' && typeof this.fileContent === 'object') {
      const safeUrl = this.fileContent as SafeUrl;
      const urlString = safeUrl.toString();
      if (urlString.startsWith('blob:')) {
        URL.revokeObjectURL(urlString);
      }
    }
    
    this.showDialog = false;
    this.fileItem = null;
    this.fileContent = null;
    this.contentType = null;
    this.error = null;
    this.loading = false;
    this.subscription?.unsubscribe();
  }

  get dialogTitle(): string {
    return this.fileItem ? `Preview: ${this.fileItem.name}` : 'File Preview';
  }

  get fileSize(): string {
    if (!this.fileItem?.size) return '';
    
    const bytes = this.fileItem.size;
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getDialogStyle(): any {
    if (this.fileType === 'image') {
      return { 
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '90vh',
        minWidth: '500px'
      };
    } else if (this.fileType === 'text') {
      return { 
        width: '70vw',
        height: 'auto',
        maxHeight: '80vh',
        minWidth: '600px'
      };
    } else {
      return { 
        width: '500px',
        height: 'auto'
      };
    }
  }
}
