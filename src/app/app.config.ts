import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(), 
    provideFirebaseApp(() => initializeApp({ "projectId": "concord-df396", "appId": "1:868078937771:web:6fe67c84ef9f4fdf0eb9ee", "storageBucket": "concord-df396.firebasestorage.app", "apiKey": "AIzaSyD3ACMsrCCpdbYkL5qIouOxUzJj0ZgP-Wo", "authDomain": "concord-df396.firebaseapp.com", "messagingSenderId": "868078937771" })), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ "projectId": "concord-df396", "appId": "1:868078937771:web:6fe67c84ef9f4fdf0eb9ee", "storageBucket": "concord-df396.firebasestorage.app", "apiKey": "AIzaSyD3ACMsrCCpdbYkL5qIouOxUzJj0ZgP-Wo", "authDomain": "concord-df396.firebaseapp.com", "messagingSenderId": "868078937771" })), provideAuth(() => getAuth())]
};
