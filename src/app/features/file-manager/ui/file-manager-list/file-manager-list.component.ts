import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor, DatePipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ISelectionModel } from '../../models';


@Component({
  standalone: true,
  selector: 'app-file-manager-list',
  imports: [NgIf, NgFor, DatePipe, TableModule, Card, ProgressSpinner,NgClass, FormsModule,CheckboxModule],
  templateUrl: './file-manager-list.component.html',
  styleUrls: ['./file-manager-list.component.scss']
})

export class FileManagerList {
  @Input() items: any[] = [];
  @Input() viewMode: 'grid'|'list' = 'list';
  @Input() selection: Set<ISelectionModel> = new Set();
  @Input() loading: boolean | null = false;
  @Input() error: string | null = null;


  @Output() itemOpened = new EventEmitter<any>();
  @Output() toggleSelected = new EventEmitter<{id: string, kind: string}>();


  isSelected(id: number) { 
    return Array.from(this.selection).some(sel => sel.id === id.toString());
  }

  formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}