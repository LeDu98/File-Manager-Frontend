import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FileManagerStore } from '../state/file-managar.store';
import { FileManagerList } from './file-manager-list/file-manager-list.component';
import { FileManagerToolbar } from './file-manager-toolbar/file-manager-toolbar.component';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.page.html',
  styleUrls: ['./file-manager.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    ToolbarModule, 
    BreadcrumbModule, 
    DataViewModule,
    MenuModule,
    ContextMenuModule,
    TooltipModule,
    FileManagerToolbar,
    FileManagerList
  ]
})
export class FileManagerPage implements OnInit {
  private store = inject(FileManagerStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Expose signals to template
  readonly viewMode = this.store.viewMode;
  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly selection = this.store.selection;
  readonly selectionCount = this.store.selectionCount;
  readonly canRename = this.store.canRename;
  readonly canDelete = this.store.canDelete;
  readonly path = this.store.path;
  readonly pathNames = this.store.pathNames;


  // Breadcrumb model for PrimeNG
  readonly breadcrumbModel = computed(() => ({
    home: { label: 'Root', command: () => this.onNavigate([]) },
    items: this.pathNames().map((name, idx, arr) => ({
      label: name,
      command: () => this.onNavigate(this.path().slice(0, idx + 1))
    }))
  }));

  ngOnInit() {
    // Read URL into signals on enter
    const segs = this.route.snapshot.url.map(u => u.path).filter(Boolean);
    this.store.navigateTo(segs);

    const qp = this.route.snapshot.queryParamMap;
    const v = (qp.get('view') as 'grid'|'list') ?? 'list';
    const by = (qp.get('by') as any) ?? 'name';
    const dir = (qp.get('dir') as any) ?? 'asc';
    this.store.setViewMode(v);
  }

  private folderEffect = effect(() => {
    const path = this.path();
    const view = this.viewMode();
    void this.router.navigate(['/', 'file-manager', ...path], {
      replaceUrl: true
    });
  });


  onNavigate(path: string[]) { 
    // For breadcrumb navigation, we need to reconstruct path names
    const pathNames = path.map((seg, idx) => {
      if (idx < this.pathNames().length && this.path()[idx] === seg) {
        return this.pathNames()[idx];
      }
      return seg; // Fallback to segment if name not available
    });
    this.store.navigateTo(path, pathNames);
  }


  // Toolbar handlers
  onRename(newName: string) { void this.store.renameSelected(newName); }
  onDelete() { void this.store.deleteSelected(); }
  onViewMode(mode: 'grid'|'list') { this.store.setViewMode(mode); }


  // List handlers
  onOpen(item: any) {
    if (item.kind === 'folder') {
      // Navigate to folder using its ID and track the name
      const newPath = [...this.path(), item.id];
      const newPathNames = [...this.pathNames(), item.name];
      this.store.navigateTo(newPath, newPathNames);
    } else {
      // open preview / download
      console.log('open file', item);
    }
  }

  onToggleSelect(id: any)  {
     this.store.toggleSelect(id); 
  }
}
