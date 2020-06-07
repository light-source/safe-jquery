# Safe jQuery

## What is it
Extends jQuery with adding methods like ._val(), ._text(),etc.. They is based on default methods, but have errorCallback, which will be calling when something is wrong - like as an element is missing. It's an easy way to have debugging and provide a safe code without additional checks

## Installation
```
yarn add @lightsource/safe-jquery
```
OR
```
npm install @lightsource/safe-jquery
```

## Example of usage

```
import $ from 'jquery';
import SafeJQuery from '@lightsource/safe-jquery';

SafeJQuery.setErrorCallback((element) => {
    console.log('Something wrong with element', element);
    // TODO
    // you can use logging like '@lightsource/log' or console.trace() for get more details
});

let name = $('.not-exist-element')._val();
```