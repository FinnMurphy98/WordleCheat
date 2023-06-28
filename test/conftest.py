from app import create_app
from config import TestConfig
import pytest

@pytest.fixture(scope='function')
def app():
    app = create_app(TestConfig)
    app_context = app.app_context()
    app_context.push()
    yield app
    app_context.pop()

@pytest.fixture(scope='function')
def client(app):
    return app.test_client()