# R116Radio Mobile App

## Installation

On macOS, make sure you installed Node, XCode, Android Studio and React Native CLI on your Mac.

To get started:

    npm install

## Debug Build

  To build for simulator, run one of the following:

    react-native run-ios
    react-native run-android

## Release Build

  - Android

  Inside project root folder, run the following command:
    
    cd android && ./gradlew assembleRelease

  New release-apk will be generated in **android/app/build/outputs/apk** folder
  Upload this file on Google Play Store.

  - iOS

  Open the project in XCode and make sure check the Auto Signing.
  Increase build number(or version number if you want)
  Click **Menu/Product/Archive** menu. This will generate new package to submit to App Store.

### How to Debug:
Shake phone to display debug options - you can reload JS or open Chrome debugger.
