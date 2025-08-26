import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-file-manager-toolbar',
  imports: [Toolbar, Button, DropdownModule, FormsModule],
  templateUrl: './file-manager-toolbar.component.html'
})
export class FileManagerToolbar {
  @Input() viewMode: 'grid'|'list' = 'list';
  @Input() canRename = false;
  @Input() canDelete = false;
  @Input() selectionCount = 0;


  @Output() renameRequested = new EventEmitter<string>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() viewModeChanged = new EventEmitter<'grid'|'list'>();


  renameValue = '';
}