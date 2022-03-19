# Imports 
import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse

thisPort = 6001

# Building the chain
class Blockchain:
    # Creates the Origin block
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof = 1, previous_hash = '0')
        self.nodes = set()
    
    # Creates a new block and adds it to the chain
    def create_block(self, proof, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': str(datetime.datetime.now()),
            'proof': proof,
            'previous_hash': previous_hash, 
            'transactions': self.transactions,
            }
        self.transactions = []
        self.chain.append(block)
        return block
    
    
    # Returns the previous block in the chain
    def get_previous_block(self):
        return self.chain[-1]


    # A simple proof of work function, to rotate nonce until hashed data 
    # begins with 4 zeroes
    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(
                str(new_proof**2 - previous_proof**2).encode()
                ).hexdigest()            
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof
    
    
    # Hashes block data using SHA256
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    
    # Validates the state of the chain by checking blocks previous_hash 
    # against the previous block's hash, from origin to end.
    def chain_validity_(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(
                str(proof**2 - previous_proof**2).encode()
                ).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            previous_block = block
            block_index += 1
        return True            
  
    # Add transaction data
    def add_transaction_(self, sender, reciever, amount):
        self.transactions.append({
            'sender': sender,
            'reciever': reciever,
            'amount': amount,
            })
        previous_block = self.get_previous_block()
        return previous_block['index'] + 1
    
    
    # Add a node to the network
    def add_node(self, address):
        result = urlparse(address)
        self.nodes.add(result.netloc)
        
    
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.chain_validity_(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False


# Mining the chain

# Setting up the Flask App
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

# Creating an address for the node on Port
node_address = str(uuid4()).replace('-', '')

# Creates a Chain
blockchain = Blockchain()

# Setting up the mine_block endpoint
@app.route('/mine_block', methods = ['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    blockchain.add_transaction_(
        sender = node_address, 
        reciever = 'Lonestar', 
        amount = 5
        )
    block = blockchain.create_block(proof, previous_hash)
    response = {
        'message': 'Block mined!',
        'index': block['index'],
        'timestamp': block['timestamp'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
        'transactions': block['transactions'],
        }
    return jsonify(response), 200


# Setting up the get_chain endpoint
@app.route('/get_chain', methods = ['GET'])
def get_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
        }
    return jsonify(response), 200



# Setting up the integrity endpoint
@app.route('/chain_integrity', methods = ['GET'])
def chain_integrity():
    chain_integrity = blockchain.chain_validity_(blockchain.chain)
    if chain_integrity:
        response = {
            'message': 'Integrity check complete, blockchain validated.'
            }
    else:
        response = {
            'message': 'Integrity check complete, blockchain is not valid.'
            }
    return jsonify(response), 200


# Adding a new transaction to the Blockchain
@app.route('/add_transaction', methods = ['POST'])
def add_transaction():
    json = request.get_json()
    transaction_keys = ['sender', 'reciever', 'amount']
    if not all (key in json for key in transaction_keys):
        return 'Transaction elements invalid', 400
    index = blockchain.add_transaction_(
        json['sender'], 
        json['reciever'], 
        json['amount'],
        )
    response = {
        'message': f'Transaction will be added to block {index}.'
        }
    return jsonify(response), 201


# Decentralizing the chain


# Connecting new nodes
@app.route('/connect_node', methods = ['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return 'No nodes found', 400
    for node in nodes:
        blockchain.add_node(node)
    response = {
        'message': (
            'Nodes connected. Quantumcoin blockchain contains '
            f'{len(list(blockchain.nodes))} nodes.'
            ),
        'total_nodes': list(blockchain.nodes),
        }
    return jsonify(response), 201


# Replacing the chain by the longest chain if needed
@app.route('/replace_chain', methods = ['GET'])
def replace_chain():
    replace_chain = blockchain.replace_chain()
    if replace_chain:
        response = {
            'message': (
                'The node had different chains so the chain was replaced by '
                'the longest one.'
                ),
            'new_chain': blockchain.chain,
                }
    else:
        response = {
            'message': 'This chain is the largest one.',
            'actual_chain': blockchain.chain,
            }
    return jsonify(response),200
    

# Run app on local host
app.run(host = '0.0.0.0', port = thisPort)
    