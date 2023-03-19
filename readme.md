## v++

### automated process for create assembleRelease for React native

#### first this will increase versionCode and versionName by one like

##### before run this
```
defaultConfig {
    applicationId "com.APPNAME"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 22
    versionName "1.21"
}
```

##### after running 'npm run update'
```
defaultConfig {
    applicationId "com.APPNAME"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 23
    versionName "1.22"
}
```