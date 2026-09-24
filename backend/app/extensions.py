from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate

# Initialize extensions without attaching to app yet (Application Factory Pattern)
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
