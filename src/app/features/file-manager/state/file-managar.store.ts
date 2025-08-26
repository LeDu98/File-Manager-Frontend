import { computed, effect, signal } from "@angular/core";

import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { IDeleteItemsRequest, IFileManagerItem, ISelectionModel, IFolderBreadcrumb } from "../models";
import { FilesApiService } from "../data/file-manager.api.services";
import { ToastService } from "../../../shared/services/toast.service";

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name'|'date'|'size';
export type SortDir = 'asc'|'desc';


@Injectable({ providedIn: 'root' })
export class FileManagerStore {
    // ---- Source signals
    readonly path = signal<string[]>([]);
    readonly pathNames = signal<string[]>([]);
    readonly breadcrumbs = signal<IFolderBreadcrumb[]>([]);
    readonly currentFolderId = signal<string | null>(null);
    readonly viewMode = signal<ViewMode>('list');

    // ---- Data & UI state
    readonly items = signal<IFileManagerItem[]>([]);
    readonly total = signal(0);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);
    readonly selection = signal<Set<ISelectionModel>>(new Set());


    // ---- Derived
    readonly folders = computed(() => this.items().filter(i => i.kind === 'folder'));
    readonly files = computed(() => this.items().filter(i => i.kind === 'file'));
    readonly selectionCount = computed(() => this.selection().size);
    readonly canRename = computed(() => this.selection().size === 1);
    readonly canDelete = computed(() => this.selection().size > 0);

    readonly currentPath = computed(() => {
        const folderId = this.currentFolderId();
        if (!folderId) return [];
        
        return [folderId];
    });

    constructor(private api: FilesApiService, private toastService: ToastService) {
        // Auto-fetch whenever core inputs change
        effect(() => {
            void this.fetch();
        });
    }
    
    async fetch() {
        this.loading.set(true);
        this.error.set(null);
        try {
            // Use current folder ID or 'root' for root folder
            const folderId = this.currentFolderId();
            
            // Fetch both content and breadcrumb path
            const [contentRes, breadcrumbRes] = await Promise.all([
                firstValueFrom(this.api.getFolderContent(folderId || '')),
                folderId ? firstValueFrom(this.api.getFolderBreadcrumbPath(folderId)) : Promise.resolve([])
            ]);
            
            console.log('Breadcrumb response:', breadcrumbRes);
            
            this.items.set([
                ...contentRes.folders.map(f => ({
                    id: f.id,
                    name: f.name,
                    kind: 'folder' as const,
                    createdOn: f.createdOn,
                    modifiedOn: f.modifiedOn
                })),
                ...contentRes.files.map(f => ({
                    id: f.id,
                    name: f.name,
                    kind: 'file' as const,
                    size: f.sizeInBytes,
                    createdOn: f.createdOn,
                    modifiedOn: f.modifiedOn
                }))
            ]);
            
            // Update breadcrumbs from API
            const breadcrumbs = Array.isArray(breadcrumbRes) ? breadcrumbRes : (breadcrumbRes || []);
            console.log('Setting breadcrumbs:', breadcrumbs);
            this.breadcrumbs.set(breadcrumbs);
            
            if (breadcrumbs.length > 0) {
                this.path.set(breadcrumbs.map((b: IFolderBreadcrumb) => b.id));
                this.pathNames.set(breadcrumbs.map((b: IFolderBreadcrumb) => b.name));
            } else {
                this.path.set([]);
                this.pathNames.set([]);
            }
            
            this.total.set(contentRes.files.length);
        } catch (e: any) {
            this.error.set(e?.message ?? 'Failed to load');
            // Reset everything on error
            this.breadcrumbs.set([]);
            this.path.set([]);
            this.pathNames.set([]);
        } finally {
            this.loading.set(false);
        }
    }
    
    // Extract folder ID from URL segments
    extractFolderIdFromUrl(urlSegments: string[]): string | null {
        if (urlSegments.length === 0) {
            return null; // Root folder
        }
        
        // Check if the last segment is a folder ID (UUID format)
        const lastSegment = urlSegments[urlSegments.length - 1];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(lastSegment)) {
            return lastSegment;
        }
        
        return null; // Not a folder ID, treat as root
    }
    
    navigateTo(folderId: string | null) {
        this.currentFolderId.set(folderId);
        this.selection.set(new Set());
        
        this.path.set([]);
        this.pathNames.set([]);
    }
    
    // navigate to a specific breadcrumb level
    navigateToBreadcrumb(index: number) {
        const breadcrumbs = this.breadcrumbs();
        if (index >= 0 && index < breadcrumbs.length) {
            const targetFolderId = breadcrumbs[index].id;
            this.navigateTo(targetFolderId);
        } else if (index === -1) {
            // navigate to root
            this.navigateTo(null);
        }
    }
    
    setViewMode(mode: ViewMode) {
         this.viewMode.set(mode); 
    }

    toggleSelect(selection: ISelectionModel) {
        const next = new Set(this.selection());
    
        const existing = Array.from(next).find(s => s.id === selection.id && s.kind === selection.kind);
        
        if (existing) {
            next.delete(existing);
        } else {
            next.add(selection);
        }
        
        this.selection.set(next);
    }

    clearSelection() { this.selection.set(new Set()); }


    async renameSelected(newName: string) {
    }

    async deleteSelected() {
        const selectedIds = Array.from(this.selection());
        if (selectedIds.length === 0) return;

        try {
            this.loading.set(true);
            let deleteItemsRequest: IDeleteItemsRequest = {
                fileIds: selectedIds.filter(_ => _.kind === 'file').map(_ => _.id),
                folderIds: selectedIds.filter(_ => _.kind === 'folder').map(_ => _.id)
            }
            await firstValueFrom(this.api.deleteItems(deleteItemsRequest));
            this.toastService.showSuccess('Success','Selected items are successfully deleted!');
            this.clearSelection();
        } catch (e: any) {
            this.toastService.showError('Error','Something went wrong with deleting selected items!');
            this.error.set(e?.message ?? 'Failed to delete');
        } finally {
            this.loading.set(false);
        }
    }
}