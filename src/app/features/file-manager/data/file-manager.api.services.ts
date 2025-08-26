import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../shared/services/http.service';
import { IFolderChildrenDto } from '../models';

@Injectable({ providedIn: 'root' })
export class FilesApiService {
    constructor(private httpService: HttpService) {}

    getFolderContent(id: string): Observable<IFolderChildrenDto> {
        return this.httpService.get<IFolderChildrenDto>(`/file-manager/${id}`);
    }
}