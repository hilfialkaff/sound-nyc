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


## Team

Everyone contributed equally in terms of work load.

- Hilfi Alkaff: Helped in the design ideas, implementation of the tooltips.
- Joseph Ciurej: Helped in the design ideas, implementation of the events. Mainly the circle displays, tooltips and legend.
- Joshua Friedman: Helped in the design ideas, entered events to visualize.
- Efe Karakus: Helped in the design ideas, implemented the map, created the legend and play all button.
- Helen Zhou: Created the design presentation, helped with the fonts and colors of the visualization.
