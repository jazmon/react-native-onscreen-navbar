# react-native-onscreen-navbar

[![Greenkeeper badge](https://badges.greenkeeper.io/jazmon/react-native-onscreen-navbar.svg)](https://greenkeeper.io/)
A React Native component to customize the Navigation Bar looks on Android.

## Preview
![](http://i.imgur.com/g95jWQ5.gif)

## Usage

#### Install
`npm install react-native-onscreen-navbar --save`

For react-native  pre 0.46.0 use a older version

`npm install react-native-onscreen-navbar@1.2.0 --save`


#### Linking (automatically)
`react-native link react-native-onscreen-navbar`

#### Linking (manually)

##### In `android/app/build.gradle`, add the lines

```diff
dependencies {
+   compile project(':react-native-onscreen-navbar')
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile "com.android.support:appcompat-v7:23.0.1"
    compile "com.facebook.react:react-native:+"  // From node_modules
}
```

##### In `android/settings.gradle`, add the lines
```diff
include ':app'
+ include ':react-native-onscreen-navbar'
+ project(':react-native-onscreen-navbar').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-onscreen-navbar/android')
```

##### In `android/app/src/main/java/com/example/MainApplication.java`, add the `NavigationBarPackage` dependency.
```diff
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
+ import com.attehuhtakangas.navigationbar.NavigationBarPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    ...
    
    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
+           new NavigationBarPackage()
        );
    }
}
```

## Example
Check [index.android.js](https://github.com/Jazmon/react-native-onscreen-navbar/blob/master/examples/ExampleProject/index.android.js) in the examples folder

## Properties

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| animate | `false` | `boolean` | Whether to animate the background color transitions |
| backgroundColor | #000000 | `string` | BackgroundColor of the Navigation Bar  |
| translucent | `false` | `boolean` | Is the Navigation Bar translucent or not |


## Acknowledgements
Inspired heavily by [StatusBar](https://github.com/facebook/react-native/blob/0.27-stable/Libraries/Components/StatusBar/StatusBar.js) in the React Native main repo.


## License

(c) 2016 Atte Huhtakangas, [MIT license](/LICENSE).
