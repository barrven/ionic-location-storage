 ### initialize project with this command: 
 $ ionic start StoreMyLocation tabs --type=angular --capacitor

 ### test project
 $ ionic build
 $ ionic serve


=========== Mobile ===========================
 ### add android 
 $ ionic cap add android

 ### make sure that android and source code versions are synchronized (whenever you install new dependencies)
 $ ionic cap copy
 $ inonic cap sync

 ### run the app on android with live reload (does not work with location)
$ ionic capacitor run android --livereload --external

### prep the project
$ ionic cap sync

### run on android
$ ionic cap run android


=========== Plugins ==============================
### geolocation plugin
$ npm install cordova-plugin-geolocation
$ npm install @ionic-native/geolocation

$ npm install cordova-plugin-device-motion
$ npm install @ionic-native/device-motion


### run the app in browser based lab
ionic lab