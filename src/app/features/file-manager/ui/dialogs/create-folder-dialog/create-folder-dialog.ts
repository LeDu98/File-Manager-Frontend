import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-create-folder-dialog',
  templateUrl: './create-folder-dialog.html',
  styleUrls: ['./create-folder-dialog.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, Dialog, Button, InputText, SharedModule]
})
export class CreateFolderDialogComponent {
  @Input() parentId: string | null = null;
  @Output() folderCreated = new EventEmitter<{ name: string; parentId: string | null }>();

  showDialog = false;
  newFolderName = '';

  show(parentId: string | null = null) {
    this.parentId = parentId;
    this.newFolderName = '';
    this.showDialog = true;
  }

  saveNewFolder() {
    if (this.newFolderName.trim()) {
      this.folderCreated.emit({
        name: this.newFolderName.trim(),
        parentId: this.parentId
      });
      this.showDialog = false;
      this.newFolderName = '';
    }
  }

  cancelNewFolder() {
    this.showDialog = false;
    this.newFolderName = '';
  }
}
