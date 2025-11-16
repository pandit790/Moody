from mongoengine import connect

def init_mongo(app):
    connect(
        db=app.config["DB_NAME"],
        host=app.config["MONGO_URI"]
    )
    