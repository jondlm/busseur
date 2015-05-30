# Busseur

A small TriMet command line tool for bus arrivals.

![busseur](https://raw.githubusercontent.com/jondlm/busseur/master/img/busseur.gif)

## Usage

```text
busseur [options]

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -s, --stop <n>             filter to a specic trimet stop id
  -r, --route <n>            filter to a specific route number
  -n, --nickname [nickname]  a custom nickname for the location
```

## Tests

```
npm install
npm test
```

## Busseur server

Trimet only allows access to their api with a token obtained on their developer
website. If you want to run your own server with your own api key, check out
the [busseur-server] repo.

[busseur-server]: https://github.com/jondlm/busseur-server

