import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify
import requests
import numpy as np
import sqlite3

##delect , func from import create_engine
#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///housing_data.db")
Base = automap_base()
# # reflect the tables
Base.prepare(engine, reflect=True)
# # Create our session (link) from Python to the DB
session = Session(engine)
# Flask Setup
#################################################
app = Flask(__name__)

@app.route("/")
def welcome():
    return (
        f"Welcome to the Warehouse of Housing Data API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/all_data<br/>"
        f"/api/v1.0/data_2016<br/>"
    )

if __name__ == '__main__':
    app.run()