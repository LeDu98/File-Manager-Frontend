export type ItemKind = 'file' | 'folder';

export interface IFileManagerItem {
    id: string;
    name: string;
    kind: ItemKind;
    size?: number;
    createdOn?: string; 
    modifiedOn?: string;
}

export interface IFileDto{
    id: string;
    name: string;
    contentType: string;
    sizeInBytes: number;
    data: Uint8Array;
    createdOn: string;
    modifiedOn: string;
    folderId: string;
}

export interface IFolderDto{
    id: string;
    name: string;
    parentId: string;
    createdOn: string;
    modifiedOn: string;
}

export interface IFolderChildrenDto{
    folderId: string;
    files: IFileDto[];
    folders: IFolderDto[];
}

export interface IDeleteItemsRequest{
    folderIds: string[];
    fileIds: string[];
}

export interface ISelectionModel{
    id: string;
    kind: string;
}

export interface IFolderBreadcrumb {
    id: string;
    name: string;
    level: number;
}

export interface IFolderBreadcrumbPath {
    breadcrumbs: IFolderBreadcrumb[];
}