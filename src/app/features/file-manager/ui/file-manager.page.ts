import { Component, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { FileManagerStore } from '../state/file-managar.store';
import { FileManagerList } from './file-manager-list/file-manager-list.component';
import { FileManagerToolbar } from './file-manager-toolbar/file-manager-toolbar.component';
import { ICreateFolderRequest, ISelectionModel } from '../models';

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
export class FileManagerPage implements OnInit, OnDestroy {
  private store = inject(FileManagerStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private urlSubscription?: Subscription;

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
  readonly breadcrumbs = this.store.breadcrumbs;
  readonly currentPath = this.store.currentPath;
  readonly currentFolderId = this.store.currentFolderId;

  // Breadcrumb model for PrimeNG
  readonly breadcrumbModel = computed(() => ({
    home: { label: 'Root', command: () => this.onNavigateToRoot() },
    items: (this.breadcrumbs() || []).map((breadcrumb, idx) => ({
      label: breadcrumb.name,
      command: () => this.onNavigateToBreadcrumb(idx)
    }))
  }));

  ngOnInit() {
    this.urlSubscription = this.route.url.subscribe(segments => {
      const segs = segments.map(s => s.path).filter(Boolean);
      const folderId = segs.length > 0 ? segs[segs.length - 1] : null;
      
      const currentFolderId = this.store.currentFolderId();
      if (currentFolderId !== folderId) {
        this.store.navigateTo(folderId);
      }
    });

    const qp = this.route.snapshot.queryParamMap;
    const v = (qp.get('view') as 'grid'|'list') ?? 'list';
    this.store.setViewMode(v);
  }

  ngOnDestroy() {
    this.urlSubscription?.unsubscribe();
  }

  onNavigateToRoot() {
    this.store.navigateTo(null);
    void this.router.navigate(['/file-manager'], { replaceUrl: true });
  }

  onNavigateToBreadcrumb(index: number) {
    this.store.navigateToBreadcrumb(index);
    const breadcrumbs = this.store.breadcrumbs();
    if (index >= 0 && index < breadcrumbs.length) {
      const folderId = breadcrumbs[index].id;
      void this.router.navigate(['/file-manager', folderId], { replaceUrl: true });
    }
  }

  // Toolbar handlers
  onRename(newName: string) { void this.store.renameSelected(newName); }
  onDelete() { void this.store.deleteSelected(); }
  onViewMode(mode: 'grid'|'list') { this.store.setViewMode(mode); }

  // List handlers
  onOpen(item: any) {
    if (item.kind === 'folder') {
      this.store.navigateTo(item.id);
      void this.router.navigate(['/file-manager', item.id], { replaceUrl: true });
    } else {
      // open preview / download
      console.log('open file', item);
    }
  }

  onToggleSelect(selection: ISelectionModel)  {
     this.store.toggleSelect(selection); 
  }

  onCreateFolder(request: ICreateFolderRequest) {
    void this.store.createFolder(request.name, request.parentId);
  }
}
