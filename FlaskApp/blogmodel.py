from peewee import *

db = MySQLDatabase(c.db_name, **c.db_kwargs)

class BaseModel(Model):
    class Meta:
        database = database

