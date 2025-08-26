import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../shared/services/http.service';
import { ICreateFolderRequest, IDeleteItemsRequest, IFolderBreadcrumb, IFolderChildrenDto } from '../models';

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
}