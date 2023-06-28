import secrets

class Config(object):
    SECRET_KEY = secrets.token_hex(16)

class TestConfig(object):
    TESTING = True