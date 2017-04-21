# json-to-env [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Convert json to key-value environment pairs


## Install

```sh
$ npm install --save json-to-env
```
or
```sh
$ npm install -g json-to-env
```


## Usage

```sh
$ json-to-env <inputfile.json> <outputfile.config> <options>
```

## How it works
Given an json input file it will output a text file of your naming, e.g.

input example:

```
{
"test1": "a test",
"testTheTest": "another test",
"nested": {
  "test3": "hello",
  "a_new_one": "goodbye"  
}
```

output:
```
export TEST1="a test"
export TEST_THE_TEST="another test"
export NESTED_TEST3="hello"
export NESTED_A_NEW_ONE="goodbye"
```

## License

Unlicense © [R.A. Lucas](ralucas.github.io)


[npm-image]: https://badge.fury.io/js/json-to-env.svg
[npm-url]: https://npmjs.org/package/json-to-env
[travis-image]: https://travis-ci.org/ralucas/json-to-env.svg?branch=master
[travis-url]: https://travis-ci.org/ralucas/json-to-env
[daviddm-image]: https://david-dm.org/ralucas/json-to-env.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ralucas/json-to-env
