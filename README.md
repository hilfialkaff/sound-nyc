# sound-nyc

Sound level of historical events in NYC

## Installation

Type the following into your terminal:
```
git clone https://github.com/efekarakus/sound-nyc
```

## Run

Type the following into your terminal:
```
cd /path/to/sound-nyc
python -m SimpleHTTPServer 8008 &
```

Visit [http://localhost:8008](http://localhost:8008)

## Requirements

- Analysis:
    - python2.7
    - [matplotlib](http://matplotlib.org/)
    - [sympy](http://sympy.org/en/index.html)

## Distance Measurement

The outdoor sound propagation [formula](http://www.me.psu.edu/lamancusa/me458/10_osp.pdf) was adapted from 
[ME 458: Engineering Noise Control](http://www.me.psu.edu/lamancusa/me458/) from PennState University.
