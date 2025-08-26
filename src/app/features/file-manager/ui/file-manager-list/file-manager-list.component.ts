import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor, DecimalPipe, DatePipe, NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  standalone: true,
  selector: 'app-file-manager-list',
  imports: [NgIf, NgFor, DecimalPipe, DatePipe, TableModule, Card, ProgressSpinner,NgClass, FormsModule,CheckboxModule],
  templateUrl: './file-manager-list.component.html'
})

export class FileManagerList {
  @Input() items: any[] = [];
  @Input() viewMode: 'grid'|'list' = 'list';
  @Input() selection: Set<string> = new Set();
  @Input() loading: boolean | null = false;
  @Input() error: string | null = null;


  @Output() itemOpened = new EventEmitter<any>();
  @Output() toggleSelected = new EventEmitter<string>();


  isSelected(id: string) { return this.selection?.has(id); }
}