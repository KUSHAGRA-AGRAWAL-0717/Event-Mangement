"""Main application module."""
import os
from flask import Flask
from flask_restful import Api

from config import config
from extensions import db, ma, migrate, cors
from resources.event import EventListResource, EventResource
from resources.participant import (
    ParticipantListResource, 
    ParticipantResource, 
    EventParticipantsResource
)


def create_app(config_name=None):
    """Create application factory."""
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    register_extensions(app)
    register_resources(app)
    
    return app


def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)


def register_resources(app):
    """Register API resources."""
    api = Api(app)
    
    # Event resources
    api.add_resource(EventListResource, '/api/events')
    api.add_resource(EventResource, '/api/events/<int:event_id>')
    
    # Participant resources
    api.add_resource(ParticipantListResource, '/api/participants')
    api.add_resource(ParticipantResource, '/api/participants/<int:participant_id>')
    api.add_resource(EventParticipantsResource, '/api/events/<int:event_id>/participants')


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
