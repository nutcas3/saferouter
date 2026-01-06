import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import JAXNERModel, app

@pytest.fixture
def ner_model():
    return JAXNERModel()

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

class TestNERModel:
    def test_detect_ssn(self, ner_model):
        text = "My SSN is 123-45-6789"
        entities = ner_model.detect_entities(text)
        assert len(entities) == 1
        assert entities[0]['type'] == 'SSN'
        assert entities[0]['original'] == '123-45-6789'
    
    def test_detect_email(self, ner_model):
        text = "Contact me at john.doe@example.com"
        entities = ner_model.detect_entities(text)
        assert len(entities) == 1
        assert entities[0]['type'] == 'EMAIL'
        assert entities[0]['original'] == 'john.doe@example.com'
    
    def test_detect_phone(self, ner_model):
        text = "Call me at 555-123-4567"
        entities = ner_model.detect_entities(text)
        assert len(entities) == 1
        assert entities[0]['type'] == 'PHONE'
    
    def test_detect_multiple_entities(self, ner_model):
        text = "John Smith's email is john@example.com and SSN is 123-45-6789"
        entities = ner_model.detect_entities(text)
        assert len(entities) >= 2
        types = [e['type'] for e in entities]
        assert 'EMAIL' in types
        assert 'SSN' in types
    
    def test_medical_domain(self, ner_model):
        text = "Patient ID: PT-12345, MRN: 1234567890"
        entities = ner_model.detect_entities(text, domain='medical')
        assert len(entities) >= 1
        types = [e['type'] for e in entities]
        assert any(t in ['PATIENT_ID', 'MRN'] for t in types)
    
    def test_legal_domain(self, ner_model):
        text = "Case Number: 21-CV-123456"
        entities = ner_model.detect_entities(text, domain='legal')
        assert len(entities) >= 1
        # Legal domain detection returns CASE_NUMBER or PERSON depending on pattern
        types = [e['type'] for e in entities]
        assert 'CASE_NUMBER' in types or 'PERSON' in types
    
    def test_token_generation(self, ner_model):
        text = "Email: test1@example.com and test2@example.com"
        entities = ner_model.detect_entities(text)
        assert len(entities) == 2
        assert entities[0]['token'] == '[EMAIL_001]'
        assert entities[1]['token'] == '[EMAIL_002]'
    
    def test_empty_text(self, ner_model):
        entities = ner_model.detect_entities("")
        assert len(entities) == 0

class TestNERAPI:
    def test_health_endpoint(self, client):
        response = client.get('/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert data['service'] == 'ner'
    
    def test_detect_endpoint(self, client):
        response = client.post('/detect', json={
            'text': 'My email is test@example.com',
            'domain': 'general'
        })
        assert response.status_code == 200
        data = response.get_json()
        assert 'entities' in data
        assert data['count'] >= 1
    
    def test_detect_empty_text(self, client):
        response = client.post('/detect', json={
            'text': '',
            'domain': 'general'
        })
        assert response.status_code == 400
    
    def test_detect_no_text(self, client):
        response = client.post('/detect', json={
            'domain': 'general'
        })
        assert response.status_code == 400
    
    def test_metrics_endpoint(self, client):
        response = client.get('/metrics')
        assert response.status_code == 200
        data = response.get_json()
        assert 'model' in data
        assert 'patterns_loaded' in data

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
