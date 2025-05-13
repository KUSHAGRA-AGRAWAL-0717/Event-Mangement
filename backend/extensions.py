"""Extensions module. Each extension is initialized in the app factory."""
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_cors import CORS

# Initialize extensions
db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
cors = CORS()
