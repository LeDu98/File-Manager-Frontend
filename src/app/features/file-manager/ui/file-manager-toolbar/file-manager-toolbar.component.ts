import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ItemNameDialogComponent } from '../dialogs';
import { ICreateFolderRequest, ISelectedItemInfo, ItemKind } from '../../models';


@Component({
  standalone: true,
  selector: 'app-file-manager-toolbar',
  imports: [Toolbar, Button, DropdownModule, ItemNameDialogComponent],
  templateUrl: './file-manager-toolbar.component.html'
})
export class FileManagerToolbar {
  @Input() viewMode: 'grid'|'list' = 'list';
  @Input() canRename = false;
  @Input() canDelete = false;
  @Input() selectionCount = 0;
  @Input() currentFolderId: string | null = null;
  @Input() selectedItem: ISelectedItemInfo | null = null;

  @Output() renameRequested = new EventEmitter<{newName: string, itemId: string, itemKind: ItemKind | null}>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() viewModeChanged = new EventEmitter<'grid'|'list'>();
  @Output() createFolderRequested = new EventEmitter<ICreateFolderRequest>();

  @ViewChild(ItemNameDialogComponent) itemNameDialog!: ItemNameDialogComponent;

  showNewFolderDialog() {
    this.itemNameDialog.showCreateDialog(this.currentFolderId);
  }

  showRenameDialog() {
    if (this.selectedItem) {
      this.itemNameDialog.showRenameDialog(this.selectedItem.id, this.selectedItem.name, this.selectedItem.kind);
    }
  }

  onCreateFolder(folderData: { name: string; parentId: string | null }) {
    this.createFolderRequested.emit(folderData);
  }

  onRenameItem(renameData: { newName: string; itemId: string; itemKind: ItemKind | null }) {
    this.renameRequested.emit(renameData);
  }
}