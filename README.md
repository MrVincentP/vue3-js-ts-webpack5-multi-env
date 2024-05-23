# vue3-js-ts-webpack5-multi-env

a demo project by vue3, pure js writing method, supports setup, supports ts parsing, uses webpack5 for packaging, supports multiple environments and multiple variables.

### Main Dependency Packages on 2024/05/22
    "vue": "^3.4.27",
    "vue-router": "^4.3.0",
    "webpack": "^5.91.0",
    "webpack-bundle-analyzer": "^4.10.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4",
    "webpack-manifest-plugin": "^5.0.0",
    "webpack-merge": "^5.10.0",
    "node": "20.11.1"


# Requirement
When we have a SAAS application with 100 menus, we need to package them into different systems according to user needs, which can be easily achieved through permission management. However, our dist folder does contain all 100 menus and files in its entirety. So how can we achieve both permission isolation and physical isolation?


Based on this requirement, I have been researching webpack for half a month. At that time, I implemented it based on webpack 3, but now it has been upgraded to webpack 5. Of course, this is based on the operation of the nodeJS environment itself.

This set of basic configuration code is being used on Vue3+webpack5 and Vue2+webpack3. Not suitable for Angular 9+ as Angular cli comes with a webpack module. I don't know how to write react, I'm not sure if I'll try it out.

### Notice
This demo is vue3+JS, TS code you can import in, but it only for parse, it not perform verification. If your project is vue3+TS, please change the code in /build folder and /domesticApp and /globalApp.

### Dist Folder Structures

    domesticApp:
        test / index.html   static folder  assets folder
        uat / index.html   static folder  assets folder
        prod / index.html   static folder  assets folder
    globalApp:
        test / index.html   static folder  assets folder
        uat / index.html   static folder  assets folder
        prod / index.html   static folder  assets folder

### Special Instructions
    Support multiple applications sharing the same project 
    Support routing extension
    Support application extension
    Support packaging extension
    Support remote paths
    Support heavyweight applications with three digit page count
    More support, wait for you to discover


