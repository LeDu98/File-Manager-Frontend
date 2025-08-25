import { Routes } from '@angular/router';
import { FileManagerPage } from './features/file-manager/ui/file-manager.page';
import { FILES_ROUTES } from './features/file-manager/file-manager.routes';

export const routes: Routes = [
    {
        path: 'file-manager',
        children: FILES_ROUTES,
    },
    {
        path: '',
        redirectTo: 'file-manager',
        pathMatch: 'full'
    }
];