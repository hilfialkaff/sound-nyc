import json

def getNYCRoutes():
    bronx = None
    queens = None
    manhattan = None
    kings = None
    
    with open('JSONs/bronx.json', 'r') as f:
        bronx = json.load(f)
    with open('JSONs/queens.json', 'r') as f:
        queens = json.load(f)
    with open('JSONs/manhattan.json', 'r') as f:
        manhattan = json.load(f)
    with open('JSONs/kings.json', 'r') as f:
        kings = json.load(f)

    return [bronx, queens, manhattan, kings]


if __name__=='__main__':
    boundaries = None
    parks = None

    with open('JSONs/boundaries.json', 'r') as f:
        boundaries = json.load(f)

    for feature in boundaries['features']:
        feature['properties']['type'] = 'boundary'

    [bronx, queens, manhattan, kings] = getNYCRoutes()
    for feature in bronx['features']:
        feature['properties']['type'] = 'road'
    for feature in queens['features']:
        feature['properties']['type'] = 'road'
    for feature in manhattan['features']:
        feature['properties']['type'] = 'road'
    for feature in kings['features']:
        feature['properties']['type'] = 'road'




    nyc = {
        "type": "FeatureCollection",
        "features": boundaries['features'] + bronx['features'] + manhattan['features'] + queens['features'] + kings['features']
    }
    
    with open('nyc.json', 'w') as f:
        json.dump(nyc, f)
