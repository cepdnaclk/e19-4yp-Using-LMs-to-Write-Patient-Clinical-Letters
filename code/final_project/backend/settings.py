from dotenv import load_dotenv
import os
from helpers.shared import get_list_from_comma_separated_string
from flask_cors import CORS

load_dotenv()

DATABASE_SETTINGS = {
    "DATABASE_NAME": os.getenv("DATABASE_NAME"),
    "DATABASE_USER": os.getenv("DATABASE_USER"),
    "DATABASE_PASSWORD": os.getenv("DATABASE_PASSWORD"),
    "DATABASE_HOST": os.getenv("DATABASE_HOST")
}

def configure_cors(app):
    headers = os.getenv("CORS_HEADERS")
    origins = os.getenv("CORS_ORIGINS")
    methods = os.getenv("CORS_METHODS")
    allow_credentials = os.getenv("CORS_ALLOW_CREDENTIALS", "False").lower() == "true"

    # Apply CORS with the settings
    CORS(
        app,
        resources={r"/*": {"origins": get_list_from_comma_separated_string(origins)}},
        supports_credentials=allow_credentials,
        allow_headers=get_list_from_comma_separated_string(headers),
        methods=get_list_from_comma_separated_string(methods),
    )