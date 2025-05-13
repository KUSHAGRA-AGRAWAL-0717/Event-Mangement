"""Participant resources."""
from flask import request
from flask_restful import Resource
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from models import Participant, Event
from schemas import participant_schema, participants_schema


class ParticipantListResource(Resource):
    """Resource for listing and creating participants."""
    
    def get(self):
        """Get all participants."""
        participants = Participant.query.all()
        return participants_schema.dump(participants), 200
    
    def post(self):
        """Create a new participant."""
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400
        
        # Check if event exists and has space
        event_id = json_data.get('event_id')
        if event_id:
            event = Event.query.get(event_id)
            if not event:
                return {"message": f"Event with id {event_id} not found"}, 404
            
            if event.max_participants and len(event.participants) >= event.max_participants:
                return {"message": "Event has reached maximum participants"}, 400
        
        try:
            participant = participant_schema.load(json_data)
            db.session.add(participant)
            db.session.commit()
            return participant_schema.dump(participant), 201
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except SQLAlchemyError as err:
            db.session.rollback()
            return {"message": "Database error", "error": str(err)}, 500


class ParticipantResource(Resource):
    """Resource for getting, updating and deleting a single participant."""
    
    def get(self, participant_id):
        """Get a single participant."""
        participant = Participant.query.get_or_404(participant_id)
        return participant_schema.dump(participant), 200
    
    def put(self, participant_id):
        """Update a participant."""
        participant = Participant.query.get_or_404(participant_id)
        json_data = request.get_json()
        if not json_data:
            return {"message": "No input data provided"}, 400
        
        try:
            updated_participant = participant_schema.load(json_data, instance=participant, partial=True)
            db.session.commit()
            return participant_schema.dump(updated_participant), 200
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
        except SQLAlchemyError as err:
            db.session.rollback()
            return {"message": "Database error", "error": str(err)}, 500
    
    def delete(self, participant_id):
        """Delete a participant."""
        participant = Participant.query.get_or_404(participant_id)
        try:
            db.session.delete(participant)
            db.session.commit()
            return {"message": "Participant deleted successfully"}, 200
        except SQLAlchemyError as err:
            db.session.rollback()
            return {"message": "Database error", "error": str(err)}, 500


class EventParticipantsResource(Resource):
    """Resource for listing participants of a specific event."""
    
    def get(self, event_id):
        """Get all participants for an event."""
        Event.query.get_or_404(event_id)  # Check if event exists
        participants = Participant.query.filter_by(event_id=event_id).all()
        return participants_schema.dump(participants), 200
