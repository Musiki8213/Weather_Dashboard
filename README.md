# Weather — Offline-Capable Dashboard

This project is a responsive Progressive Web App that fetches and displays real-time weather or news data. It supports offline functionality, storing the last successful API response in `localStorage` and notifying users when offline.

## Features
- Fetches live data from OpenWeatherMap API or NewsAPI  
- Responsive layout with CSS Grid/Flexbox and clean card/tile design  
- Offline mode with cached data display and offline indicator  
- Dark/light theme toggle with system preference detection  
- Search and filter functionality (locations for weather, categories for news)  
- Manual refresh and pull-to-refresh support  
- Geolocation support with default fallback  
- PWA features: Service Worker, Web Manifest, installable app  
- Optional: Push notifications for weather alerts or breaking news  
- Social sharing support using Web Share API  

## How to Use
1. Open the app in a modern browser.  
2. Allow geolocation (for weather) or select a news category.  
3. Browse real-time data; if offline, cached data will be displayed.  
4. Toggle dark/light theme, refresh data, or search/filter as needed.  

## Technologies
- HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript (ES6+)  
- OpenWeatherMap API or NewsAPI  
- localStorage for offline data  
- Service Worker and Web Manifest for PWA features
