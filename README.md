# Busseur

```
npm install -g busseur
```

A small TriMet command line tool for bus arrivals. It will automatically
refresh every minute. It's great for squeezing in those extra few minutes of
coding.

Also, it's written with RxJs so it's declarative. It's kind of like React,
every time your state changes, it throws away everything on the screen and
repaints (minus the diffing).

![busseur](https://raw.githubusercontent.com/jondlm/busseur/master/img/busseur.gif)

## Usage

```text
busseur [options]

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -s, --stop <n>             filter to a specic TriMet stop id (required)
  -r, --route [n]            filter to a specific set of routes (repeatable)
  -n, --nickname [nickname]  a custom nickname for the location
  -t, --threshold [minutes]  number of minutes for the notification threshold (0 >= t >= 30)
  --disable-notifications    turn off notifications

```

## Tests

```
npm install
npm test
```

## Busseur server

TriMet only allows access to their api with a token obtained on their developer
website. If you want to run your own server with your own api key, check out
the [busseur-server] repo.

[busseur-server]: https://github.com/jondlm/busseur-server

