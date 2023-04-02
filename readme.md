## v++

### automated process form versioning create assembleRelease for React native

### ROOT 🤔 : in my workplace i had to create a android build and upload it to google drive END OF THE DAY felt like doing same thing again and again so i got this idea and created this automated process from increase versionCode and versionName by one to uploading apk to google drive

### TODO
 * to create new version of the applicaiton ✔️
 * upload apk to google drive ✔️
 * upload apk to firestore ❌
 * publish to store ❌

#### first this will increase versionCode and versionName by 1

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

## for the googleapis credentials.json is must generate it via console

Ingrediants
```
commander <-- possible to pass args with this
dotenv <-- use for hide api keys and ...
fs <-- file handler
mime <-- mime type
shelljs <-- shell handler
googleapis <-- google API 
@google-cloud/local-auth <-- auth throught browser
```

### Final
![](/imgs/1.JPG)




