from test.conftest import client

def test_status(client):
    """
    GIVEN a client
    WHEN they GET request the index page
    THEN they should receive a 302 response, followed by a 200 response
    """
    response1 = client.get('/', content_type='html/text')
    response2 = client.get('/', content_type='html/text', follow_redirects=True)
    assert response1.status_code == 302
    assert response2.status_code == 200