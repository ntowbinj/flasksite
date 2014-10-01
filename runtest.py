from FlaskApp.tests.db_conn_stress import *

if __name__ == "__main__":
    for i in xrange(10):
        hit()
        time.sleep(.5)


