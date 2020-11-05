from flask import Flask, jsonify, g
import json
import os.path
import sqlite3
from werkzeug.utils import secure_filename # This tool allows us to make sure user uploaded files are safe

app = Flask(__name__) # This is the name of the module running in flask

DATABASE = '../sqlite/all_avg_sfh_price.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# @app.teardown_appcontext
# def close_connection(exception):
#     db = getattr(g, '_database', None)
#     if db is not None:
#         db.close()

# @app.route('/') # This is for someone visiting the home page
# def home():
#     cur = get_db().cursor().

# def make_dicts(cursor, row):
#     return dict((cursor.description[idx][0], value)
#                 for idx, value in enumerate(row))

# db.row_factory = make_dicts

# def query_db(query, args=(), one=False):
#     cur = get_db().execute(query, args)
#     rv = cur.fetchall()
#     cur.close()
#     return (rv[0] if rv else None) if one else rv