# building exo

requires python 3.8 or later

## installing htmlfive

the build process has a dependency on the `htmlfive` package - install using:

```
python -m pip install https://github.com/niallmcc/html-five/releases/download/v0.0.1/htmlfive-0.0.1.tar.gz
```

## running the build

The build will populate files in `versions/latest`:

```
cd support
python build.py
```
