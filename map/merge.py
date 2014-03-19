import json

if __name__=='__main__':
    boundaries = None
    routes = None
    with open('boundaries.json', 'r') as f:
        boundaries = json.load(f)
    with open('routes.json', 'r') as f:
        routes = json.load(f)

    nyc = {
        "type": "FeatureCollection",
        "features": boundaries['features'] + routes['features']
    }
    
    with open('nyc.json', 'w') as f:
        json.dump(nyc, f)
