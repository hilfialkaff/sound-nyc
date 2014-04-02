from sympy.solvers import solve
from sympy import Symbol, log
from math import log10
import matplotlib.pyplot as plt

A_ATMOSPHERE = 14.1/1000
A_WEATHER = 0.25/100
A_GROUND = 1.0/1000
A_BARRIER = 2.84                       # assume no barriers
DISTANCE_BUILDINGS = 20.0

EARDRUM_DECIBEL = 160.0
DANGER_DECIBEL = 120.0
MIN_DECIBEL = 85.0

def solve_r(source,target):
    """
    @param source decibel of source
    @param target decibel of target
    @return radius {@code r} in meters needed to achieve decidel {@param target} from {@param source}
    """
    r = Symbol('r')
    return solve(source-target-20*log(r,10)-A_ATMOSPHERE*r-A_WEATHER*r-A_GROUND*r-A_BARRIER*r/DISTANCE_BUILDINGS,r)[0]

def solve_db(source,r):
    """
    @param source decibel of source
    @param r radius in meters
    @return decibel of the location away by {@param r} meters from the source with {@param source} dBs
    """
    t = Symbol('t')
    return solve(source-t-20*log10(r)-A_ATMOSPHERE*r-A_WEATHER*r-A_GROUND*r-A_BARRIER*r/DISTANCE_BUILDINGS,t)[0]

def plot(source, name):
    print name
    db = source
    r = 1
    distances = []
    decibels = []
    while db > MIN_DECIBEL:
        db = solve_db(source, r)
        print r,db

        decibels.append(db)
        distances.append(r)
        r += 10
    # endwhile
    plt.plot(distances,decibels, '-r')

    if source >= EARDRUM_DECIBEL:
        plt.plot([solve_r(source,EARDRUM_DECIBEL)], [EARDRUM_DECIBEL], 'yo')
    if source >= DANGER_DECIBEL:
        plt.plot([solve_r(source,DANGER_DECIBEL)], [DANGER_DECIBEL], 'bo')
    if source >= MIN_DECIBEL:
        plt.plot([solve_r(source,MIN_DECIBEL)], [MIN_DECIBEL], 'go')
    plt.plot([solve_r(source,0.0)], [0.0], 'po')
    plt.xlabel('Distance in meters from source')
    plt.ylabel('Decibels')
    plt.savefig(name)
    plt.clf()

def plot_twintowers():
    plot(198.1, 'twintowers.png')

def plot_steampipe():
    plot(150.0, 'steampipe.png')

def plot_balldrop():
    plot(120.0, 'balldrop.png')

def plot_restaurant():
    plot(106.0, 'restaurant.png')

def plot_johnlennon():
    plot(153.5, 'lennon.png')

def plot_wallstreet():
    plot(175.0, 'wallstreet.png')

def plot_bieber():
    plot(110.0, 'bieber.png')

def plot_lightning():
    plot(120.0, 'lightning.png')

def plot_all():
    plot_twintowers()
    plot_steampipe()
    plot_balldrop()
    plot_restaurant()
    plot_johnlennon()
    plot_wallstreet()
    plot_bieber()
    plot_lightning()

def print_solve(source,name):
    print name
    print "==========="
    if source >= EARDRUM_DECIBEL:
        print "Eardrum distance: ", solve_r(source,EARDRUM_DECIBEL)
    if source >= DANGER_DECIBEL:
        print "Danger distance: ", solve_r(source,DANGER_DECIBEL)
    if source >= MIN_DECIBEL:
        print "Min distance: ", solve_r(source,MIN_DECIBEL)
    print "Safe distance: ", solve_r(source, 0.0)

def solve_twintowers():
    print_solve(198.1, "TWINTOWERS")

def solve_steampipe():
     print_solve(150.0, "STEAMPIPE")

def solve_balldrop():
    print_solve(120.0, "BALLDROP")

def solve_restaurant():
    print_solve(106.0, "RESTAURANT")

def solve_johnlennon():
    print_solve(153.5, "LENNON")

def solve_wallstreet():
    # haha
    print_solve(175.0, "WALLSTREET")

def solve_bieber():
    # you wish
    print_solve(110.0, "BIEBER")

def solve_lightning():
    # lolololol
    print_solve(120.0, "LIGHTNING")

def solve_train():
    print_solve(94.0, "CHOO CHOO")

def solve_airplane_takeoff():
    print_solve(180.0, "AIRPLANE TAKEOFF")

def solve_all():
    solve_twintowers()
    print " "
    solve_steampipe()
    print " "
    solve_balldrop()
    print " "
    solve_restaurant()
    print " "
    solve_johnlennon()
    print " "
    solve_wallstreet()
    print " "
    solve_bieber()
    print " "
    solve_lightning()
    print " "
    solve_train()
    print " "
    solve_airplane_takeoff()

if __name__=='__main__':
    #plot_all()
    solve_all()
