"""Schemas for serialization and deserialization."""
from marshmallow import fields, validate
from extensions import ma
from models import Event, Participant


class ParticipantSchema(ma.SQLAlchemySchema):
    """Schema for Participant model."""
    
    class Meta:
        model = Participant
        load_instance = True
        
    id = ma.auto_field(dump_only=True)
    name = ma.auto_field(required=True)
    email = ma.auto_field(required=True, validate=validate.Email())
    phone = ma.auto_field()
    registration_date = ma.auto_field(dump_only=True)
    event_id = ma.auto_field(required=True)


class EventSchema(ma.SQLAlchemySchema):
    """Schema for Event model."""
    
    class Meta:
        model = Event
        load_instance = True
        
    id = ma.auto_field(dump_only=True)
    title = ma.auto_field(required=True)
    description = ma.auto_field()
    start_date = ma.auto_field(required=True)
    end_date = ma.auto_field(required=True)
    location = ma.auto_field()
    max_participants = ma.auto_field()
    created_at = ma.auto_field(dump_only=True)
    updated_at = ma.auto_field(dump_only=True)
    
    # Nested participants
    participants = fields.Nested(ParticipantSchema, many=True, dump_only=True)


# Initialize schemas
event_schema = EventSchema()
events_schema = EventSchema(many=True)
participant_schema = ParticipantSchema()
participants_schema = ParticipantSchema(many=True)
