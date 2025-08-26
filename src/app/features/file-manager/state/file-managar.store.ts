import { computed, effect, signal } from "@angular/core";

import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { IFileManagerItem } from "../models";
import { FilesApiService } from "../data/file-manager.api.services";

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name'|'date'|'size';
export type SortDir = 'asc'|'desc';


@Injectable({ providedIn: 'root' })
export class FileManagerStore {
    // ---- Source signals
    readonly path = signal<string[]>([]);
    readonly pathNames = signal<string[]>([]);
    readonly currentFolderId = signal<string | null>(null);
    readonly viewMode = signal<ViewMode>('list');

    // ---- Data & UI state
    readonly items = signal<IFileManagerItem[]>([]);
    readonly total = signal(0);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);
    readonly selection = signal<Set<string>>(new Set());


    // ---- Derived
    readonly folders = computed(() => this.items().filter(i => i.kind === 'folder'));
    readonly files = computed(() => this.items().filter(i => i.kind === 'file'));
    readonly selectionCount = computed(() => this.selection().size);
    readonly canRename = computed(() => this.selection().size === 1);
    readonly canDelete = computed(() => this.selection().size > 0);

    constructor(private api: FilesApiService) {
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
            const res = await firstValueFrom(this.api.getFolderContent(folderId || ''));
            this.items.set([
                ...res.folders.map(f => ({
                    id: f.id,
                    name: f.name,
                    kind: 'folder' as const,
                    createdOn: f.createdOn,
                    modifiedOn: f.modifiedOn
                })),
                ...res.files.map(f => ({
                    id: f.id,
                    name: f.name,
                    kind: 'file' as const,
                    size: f.sizeInBytes,
                    createdOn: f.createdOn,
                    modifiedOn: f.modifiedOn
                }))
            ]);
            this.total.set(res.files.length);
        } catch (e: any) {
        this.error.set(e?.message ?? 'Failed to load');
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
    
    navigateTo(path: string[], pathNames?: string[]) {
        this.path.set(path);
        this.pathNames.set(pathNames || path);
        const folderId = this.extractFolderIdFromUrl(path);
        this.currentFolderId.set(folderId);
        this.selection.set(new Set());
    }
    
    setViewMode(mode: ViewMode) {
         this.viewMode.set(mode); 
    }

    toggleSelect(id: string) {
        const next = new Set(this.selection());
        if (next.has(id)) next.delete(id); else next.add(id);
        this.selection.set(next);
    }

    clearSelection() { this.selection.set(new Set()); }


    async renameSelected(newName: string) {
    }

    async deleteSelected() {
    }
}