import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CreateFolderDialogComponent } from '../dialogs';
import { ICreateFolderRequest } from '../../models';


@Component({
  standalone: true,
  selector: 'app-file-manager-toolbar',
  imports: [Toolbar, Button, DropdownModule, CreateFolderDialogComponent],
  templateUrl: './file-manager-toolbar.component.html'
})
export class FileManagerToolbar {
  @Input() viewMode: 'grid'|'list' = 'list';
  @Input() canRename = false;
  @Input() canDelete = false;
  @Input() selectionCount = 0;
  @Input() currentFolderId: string | null = null;

  @Output() renameRequested = new EventEmitter<string>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() viewModeChanged = new EventEmitter<'grid'|'list'>();
  @Output() createFolderRequested = new EventEmitter<ICreateFolderRequest>();

  @ViewChild(CreateFolderDialogComponent) createFolderDialog!: CreateFolderDialogComponent;
  
  renameValue = '';

  showNewFolderDialog() {
    this.createFolderDialog.show(this.currentFolderId);
  }

  onCreateFolder(folderData: { name: string; parentId: string | null }) {
    this.createFolderRequested.emit(folderData);
  }
}