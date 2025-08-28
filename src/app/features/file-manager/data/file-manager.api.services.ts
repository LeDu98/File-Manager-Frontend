import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../shared/services/http.service';
import { ICreateFolderRequest, IDeleteItemsRequest, IFolderBreadcrumb, IFolderChildrenDto, IRenameItemRequest, IUploadResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FilesApiService {
    constructor(private httpService: HttpService) {}

    getFolderContent(id: string): Observable<IFolderChildrenDto> {
        return this.httpService.get<IFolderChildrenDto>(`/file-manager/${id}`);
    }

    getFolderBreadcrumbPath(id: string): Observable<IFolderBreadcrumb[]> {
        return this.httpService.get<IFolderBreadcrumb[]>(`/file-manager/breadcrumb/${id}`);
    }

    deleteItems(deleteItemsRequest: IDeleteItemsRequest): Observable<void> {
        return this.httpService.post<void>(`/file-manager/batch/delete`, deleteItemsRequest);
    }

    createFolder(request: ICreateFolderRequest): Observable<void> {
        return this.httpService.post<void>(`/folder/create`, request);
    }

    renameFolder(request: IRenameItemRequest): Observable<void> {
        return this.httpService.post<void>(`/folder/rename`, request);
    }

    renameFile(request: IRenameItemRequest): Observable<void> {
        return this.httpService.post<void>(`/file/rename`, request);
    }

    uploadFiles(files: File[], parentId: string | null): Observable<IUploadResponse> {
        const formData = new FormData();
         
        files.forEach((file) => {
            formData.append('Files', file);
        });
        
        if (parentId) {
            formData.append('ParentId', parentId);
        }
        
        return this.httpService.postFormData<IUploadResponse>('/file/upload', formData);
    }

    getFileContent(fileId: string): Observable<{ data: Uint8Array; contentType: string }> {
        return this.httpService.getBinary(`/file/${fileId}/content`).pipe(
            map((response) => ({
                data: new Uint8Array(response.data),
                contentType: response.contentType
            }))
        );
    }
}