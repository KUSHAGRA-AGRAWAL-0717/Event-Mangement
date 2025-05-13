"""Event resources."""
from flask import request
from flask_restful import Resource
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from models import Event
from schemas import event_schema, events_schema


class EventListResource(Resource):
    """Resource for listing and creating events."""
    
    def get(self):
        """Get all events."""
        events = Event.query.all()
        return events_schema.dump(events), 200
    
    def post(self):
        """Create a new event."""
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400
        
        try:
            event = event_schema.load(json_data)
            db.session.add(event)
            db.session.commit()
            return event_schema.dump(event), 201
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except SQLAlchemyError as err:
            db.session.rollback()
            return {"message": "Database error", "error": str(err)}, 500


class EventResource(Resource):
    """Resource for getting, updating and deleting a single event."""
    
    def get(self, event_id):
        """Get a single event."""
        event = Event.query.get_or_404(event_id)
        return event_schema.dump(event), 200
    
    def put(self, event_id):
        """Update an event."""
        event = Event.query.get_or_404(event_id)
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400
        
        try:
            updated_event = event_schema.load(json_data, instance=event, partial=True)
            db.session.commit()
            return event_schema.dump(updated_event), 200
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except SQLAlchemyError as err:
            db.session.rollback()
            return {"message": "Database error", "error": str(err)}, 500
    
    def delete(self, event_id):
        """Delete an event."""
        event = Event.query.get_or_404(event_id)
        try:
            db.session.delete(event)
            db.session.commit()
            return {"message": "Event deleted successfully"}, 200
        except SQLAlchemyError as err:
            db.session.rollback()
            return {"message": "Database error", "error": str(err)}, 500
