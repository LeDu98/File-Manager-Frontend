import { Routes } from '@angular/router';
import { FileManagerPage } from './ui/file-manager.page';


export const FILES_ROUTES: Routes = [
    {
        path: '',
        component: FileManagerPage,
    },
    {
        path: '**',
        component: FileManagerPage,
    }
];  