import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-item-name-dialog',
  templateUrl: './item-name-dialog.html',
  styleUrls: ['./item-name-dialog.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, Dialog, Button, InputText, SharedModule]
})
export class ItemNameDialogComponent {
  @Input() parentId: string | null = null;
  @Output() folderCreated = new EventEmitter<{ name: string; parentId: string | null }>();
  @Output() itemRenamed = new EventEmitter<{ newName: string; itemId: string; itemKind: 'file' | 'folder' | null }>();

  showDialog = false;
  itemName = '';
  originalFileName = '';
  fileExtension = '';
  dialogMode: 'create' | 'rename' = 'create';
  itemId: string | null = null;
  itemKind: 'file' | 'folder' | null = null;
  validationError = '';

  private readonly invalidChars = /[\\/:*?"<>|]/;

  showCreateDialog(parentId: string | null = null) {
    this.dialogMode = 'create';
    this.parentId = parentId;
    this.itemName = '';
    this.originalFileName = '';
    this.fileExtension = '';
    this.itemId = null;
    this.validationError = '';
    this.showDialog = true;
  }

  showRenameDialog(itemId: string, currentName: string, itemKind: 'file' | 'folder') {
    this.dialogMode = 'rename';
    this.itemId = itemId;
    this.itemKind = itemKind;
    this.parentId = null;
    this.originalFileName = currentName;
    this.validationError = '';

    if (itemKind === 'file') {
      const lastDotIndex = currentName.lastIndexOf('.');
      if (lastDotIndex > 0) {
        this.itemName = currentName.substring(0, lastDotIndex);
        this.fileExtension = currentName.substring(lastDotIndex);
      } else {
        this.itemName = currentName;
        this.fileExtension = '';
      }
    } else {
      this.itemName = currentName;
      this.fileExtension = '';
    }

    this.showDialog = true;
  }

  save() {
    if (!this.validateInput()) {
      return;
    }

    const trimmedName = this.itemName.trim();
    
    if (this.dialogMode === 'create') {
      this.folderCreated.emit({
        name: trimmedName,
        parentId: this.parentId
      });
    } else if (this.dialogMode === 'rename' && this.itemId) {
      // For files, send only the name without extension to backend
      // For folders, send the full name
      this.itemRenamed.emit({
        newName: trimmedName,
        itemId: this.itemId,
        itemKind: this.itemKind
      });
    }
    this.closeDialog();
  }

  cancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.showDialog = false;
    this.itemName = '';
    this.originalFileName = '';
    this.fileExtension = '';
    this.itemId = null;
    this.itemKind = null;
    this.parentId = null;
    this.validationError = '';
  }

  validateInput(): boolean {
    const trimmedName = this.itemName.trim();
    
    if (!trimmedName) {
      this.validationError = 'Name cannot be empty';
      return false;
    }

    if (this.invalidChars.test(trimmedName)) {
      this.validationError = 'Name cannot contain any of the following characters: \\ / : * ? " < > |';
      return false;
    }

    if (trimmedName.endsWith('.') || trimmedName.endsWith(' ')) {
      this.validationError = 'Name cannot end with a dot or space';
      return false;
    }

    this.validationError = '';
    return true;
  }

  onInputChange() {
    this.validateInput();
  }

  get dialogTitle(): string {
    if (this.dialogMode === 'create') {
      return 'Create New Folder';
    } else {
      return `Rename ${this.itemKind === 'folder' ? 'Folder' : 'File'}`;
    }
  }

  get inputLabel(): string {
    if (this.dialogMode === 'create') {
      return 'Folder Name';
    } else {
      return `New ${this.itemKind === 'folder' ? 'Folder' : 'File'} Name`;
    }
  }

  get inputPlaceholder(): string {
    if (this.dialogMode === 'create') {
      return 'Enter folder name';
    } else {
      return `Enter new ${this.itemKind === 'folder' ? 'folder' : 'file'} name`;
    }
  }

  get saveButtonLabel(): string {
    if (this.dialogMode === 'create') {
      return 'Create';
    } else {
      return `Rename ${this.itemKind === 'folder' ? 'Folder' : 'File'}`;
    }
  }

  get isFormValid(): boolean {
    return !!(this.itemName && this.itemName.trim() && !this.validationError);
  }
}
