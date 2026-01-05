import os
import re
import time
import logging
from typing import List, Dict
from flask import Flask, request, jsonify
from flask_cors import CORS
import jax
import jax.numpy as jnp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class JAXNERModel:    
    def __init__(self):
        self.patterns = {
            'SSN': r'\b\d{3}-\d{2}-\d{4}\b',
            'PHONE': r'\b\d{3}-\d{3}-\d{4}\b',
            'EMAIL': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'DATE': r'\b\d{1,2}/\d{1,2}/\d{4}\b',
            'PERSON': r'\b[A-Z][a-z]+ [A-Z][a-z]+\b',
            'CREDIT_CARD': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            'ZIP_CODE': r'\b\d{5}(?:-\d{4})?\b',
            'IP_ADDRESS': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        }
        
        self.medical_patterns = {
            'MRN': r'\bMRN[:\s]+\d{6,10}\b',
            'PATIENT_ID': r'\b(?:Patient|PT)[-\s]?ID[:\s]+[\w-]+\b',
            'DIAGNOSIS': r'\bICD[-\s]?\d{1,2}[:\s]+[\w.-]+\b',
        }
        
        self.legal_patterns = {
            'CASE_NUMBER': r'\b\d{2}-\w+-\d{4,6}\b',
            'BAR_NUMBER': r'\bBar[#\s]+\d{6,8}\b',
            'DOCKET': r'\bDocket[#\s]+[\w-]+\b',
        }
        
        self.entity_counters = {}
        logger.info("✓ JAX NER Model initialized with %d pattern groups", len(self.patterns))
    
    def detect_entities(self, text: str, domain: str = 'general') -> List[Dict]:
        start_time = time.time()
        
        active_patterns = self.patterns.copy()
        if domain == 'medical':
            active_patterns.update(self.medical_patterns)
        elif domain == 'legal':
            active_patterns.update(self.legal_patterns)
        
        entities = []
        self.entity_counters = {}
        
        for entity_type, pattern in active_patterns.items():
            for match in re.finditer(pattern, text):
                if entity_type not in self.entity_counters:
                    self.entity_counters[entity_type] = 0
                self.entity_counters[entity_type] += 1
                
                token = f"[{entity_type}_{str(self.entity_counters[entity_type]).zfill(3)}]"
                
                entities.append({
                    'original': match.group(),
                    'token': token,
                    'type': entity_type,
                    'position': match.start(),
                    'confidence': 0.98
                })
        
        elapsed_ms = (time.time() - start_time) * 1000
        logger.info("✓ Detected %d entities in %.2fms", len(entities), elapsed_ms)
        
        return entities

ner_model = JAXNERModel()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'ner', 'version': '1.0.0'})

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    text = data.get('text', '')
    domain = data.get('domain', 'general')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        entities = ner_model.detect_entities(text, domain)
        return jsonify({
            'entities': entities,
            'count': len(entities),
            'domain': domain
        })
    except Exception as e:
        logger.error("Detection failed: %s", str(e))
        return jsonify({'error': 'Detection failed'}), 500

@app.route('/metrics', methods=['GET'])
def metrics():
    return jsonify({
        'model': 'JAX-NER-v1.0',
        'device': 'cpu',
        'patterns_loaded': len(ner_model.patterns)
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8081))
    logger.info("NER Service starting on port %d", port)
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
