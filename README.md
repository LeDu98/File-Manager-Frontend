# File Manager Project - Web Client

A modern, feature-rich file management application built with Angular 19 and PrimeNG. This web client provides an intuitive interface for managing files and folders with support for upload, download, rename, delete, and preview operations.

## 🚀 Features

- **File & Folder Management**: Create, rename, delete files and folders
- **File Upload**: Multi-file upload with drag-and-drop support
- **File Preview**: Preview files directly in the browser
- **Navigation**: Breadcrumb navigation and folder hierarchy
- **View Modes**: Switch between grid and list view
- **Selection**: Multi-select items for batch operations
- **Responsive Design**: Modern UI with PrimeNG components
- **Error Handling**: Comprehensive error handling with user feedback
- **Real-time Updates**: Automatic refresh after operations

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18.x or higher)
- **npm** (version 9.x or higher)
- **Angular CLI** (version 19.x)
- **Backend API** running on `https://localhost:44396/api`

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Web.Client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Backend URL
The application is configured to connect to the backend API at `https://localhost:44396/api`. If your backend runs on a different URL, update the `baseUrl` in:
```typescript
// src/app/shared/services/http.service.ts
private readonly baseUrl = 'https://localhost:44396/api';
```

### 4. Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### 5. Build for Production
```bash
npm run build
# or
ng build
```
The build artifacts will be stored in the `dist/web.client/` directory.

## 🏗️ Architecture Overview

### Project Structure
```
src/
├── app/
│   ├── features/
│   │   └── file-manager/           # File manager feature module
│   │       ├── data/               # API services
│   │       ├── models/             # TypeScript interfaces
│   │       ├── state/              # State management (signals-based)
│   │       └── ui/                 # Components and pages
│   │           ├── dialogs/        # Modal dialogs
│   │           ├── file-manager-list/
│   │           ├── file-manager-toolbar/
│   │           └── file-manager.page.ts
│   ├── layout/
│   │   └── sidebar/                # Application sidebar
│   └── shared/
│       └── services/               # Shared services
└── styles.scss                    # Global styles
```

### Architecture Decisions

#### 1. **Feature-Based Architecture**
- Organized by features rather than technical layers
- Each feature contains its own data, models, state, and UI components
- Promotes maintainability and scalability

#### 2. **Angular Signals for State Management**
- Utilizes Angular's new signals API for reactive state management
- `FileManagerStore` service manages application state using signals
- Computed signals for derived state (folders, files, selection counts)
- Effects for automatic data fetching on state changes

#### 3. **Standalone Components**
- Modern Angular approach using standalone components
- Reduced boilerplate and improved tree-shaking
- Simplified dependency injection

#### 4. **PrimeNG UI Library**
- Comprehensive component library with consistent design
- Built-in accessibility features
- Lara theme for modern appearance
- Rich components for file management (DataView, Toolbar, Dialogs)

#### 5. **TypeScript-First Approach**
- Strict TypeScript configuration for better type safety
- Comprehensive interfaces for all data models
- Strong typing throughout the application

#### 6. **Service-Oriented Architecture**
- Separation of concerns with dedicated services:
  - `HttpService`: HTTP communication wrapper
  - `FilesApiService`: File management API calls
  - `ErrorHandlerService`: Centralized error handling
  - `ToastService`: User notifications

#### 7. **Reactive Programming**
- RxJS for handling asynchronous operations
- Observable-based HTTP communication
- Error handling with retry mechanisms

## 🔧 Key Components

### FileManagerStore
Central state management service using Angular signals:
- **State**: Current folder, items, selection, loading states
- **Actions**: Navigate, select, create, rename, delete, upload
- **Computed**: Derived state like filtered items and selection counts

### FileManagerPage
Main page component that orchestrates the file management interface:
- Integrates toolbar, list, and dialogs
- Handles navigation and breadcrumbs
- Manages component communication

### API Integration
RESTful API integration with the backend:
- File operations (upload, download, rename, delete)
- Folder operations (create, navigate, delete)
- Breadcrumb navigation support
- Binary file handling for previews

## 🌐 API Endpoints

The application communicates with the following backend endpoints:

- `GET /file-manager/{id}` - Get folder contents
- `GET /file-manager/breadcrumb/{id}` - Get breadcrumb path
- `POST /file-manager/batch/delete` - Delete multiple items
- `POST /folder/create` - Create new folder
- `POST /folder/rename` - Rename folder
- `POST /file/rename` - Rename file
- `POST /file/upload` - Upload files
- `GET /file/{id}/content` - Download file content

## 🚦 Known Limitations

### 1. **Backend Dependency**
- Application requires a running backend API at `https://localhost:44396/api`
- No offline functionality or local storage fallback
- Hard-coded backend URL (should be configurable via environment)

### 2. **File Size Limitations**
- Large file uploads may cause performance issues
- No chunked upload implementation
- Browser memory limitations for file previews

### 3. **Browser Compatibility**
- Modern browser features required (ES2022, Angular 19)
- No Internet Explorer support
- File API and FormData dependencies

### 4. **Security Considerations**
- No client-side file type validation
- CORS configuration required for backend
- No authentication/authorization implementation

### 5. **Performance Limitations**
- No virtualization for large file lists
- All folder contents loaded at once
- No pagination implementation

### 6. **Mobile Responsiveness**
- Limited mobile optimization
- Touch gestures not fully implemented
- Small screen layout could be improved

### 7. **Error Recovery**
- Limited offline error handling
- No retry mechanisms for failed operations
- Network errors may require page refresh

### 8. **Accessibility**
- Keyboard navigation could be enhanced
- Screen reader support needs improvement
- Focus management in modals

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test -- --watch

# Run e2e tests (if configured)
ng e2e
```

## 📦 Build Configuration

The project uses Angular's modern build system with:
- **Development**: Source maps, no optimization
- **Production**: Optimized bundles, hash-based caching
- **Bundle Analysis**: Size budgets for performance monitoring

## 🔄 Future Improvements

1. **Environment Configuration**: Configurable API endpoints
2. **Authentication**: User authentication and authorization
3. **File Validation**: Client-side file type and size validation
4. **Chunked Upload**: Support for large file uploads
5. **Virtualization**: Performance optimization for large lists
6. **PWA Support**: Service worker for offline functionality
7. **Accessibility**: Enhanced keyboard and screen reader support
8. **Mobile Optimization**: Improved touch and responsive design
9. **Internationalization**: Multi-language support
10. **Unit Tests**: Comprehensive test coverage

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.