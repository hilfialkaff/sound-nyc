import json


def deleteRoutes(routes):
    wanted = ['St', 'Ave', 'Blvd', 'Dr', 'Pky']
    features = []
    for feature in routes['features']:
        if feature['properties']['FETYPE'] in wanted:
            features.append(feature)
    routes['features'] = features


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


def setType(data, val):
    for feature in data['features']:
        feature['properties']['type'] = val


if __name__=='__main__':
    boundaries = None

    with open('JSONs/boundaries.json', 'r') as f:
        boundaries = json.load(f)

    setType(boundaries, 'boundary')

    [bronx, queens, manhattan, kings] = getNYCRoutes()

    setType(bronx, 'road')
    setType(queens, 'road')
    setType(manhattan, 'road')
    setType(kings, 'road')

    nyc = {
        "type": "FeatureCollection",
        "features": boundaries['features'] + bronx['features'] + manhattan['features'] + queens['features'] + kings['features']
    }
    
    with open('nyc.json', 'w') as f:
        json.dump(nyc, f)
