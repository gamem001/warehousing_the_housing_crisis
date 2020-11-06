import numpy as np
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify

engine = create_engine("sqlite:///all_housing_data.db")

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)

@app.route("/")
def home():
    session = Session(engine)
    states = states.query(states.states).order_by(states.states)
    home = list(np.ravel(states))
    return jsonify(home)

# So for our project we only need flask to jsonify our sqlite
# you need flask to set up your api where you're going to build your front end off of it
# we're going to join our tables?
# You want to make your joins in flask, then hit this endpoint with your JS, which will load the data and build charts off of it
# So each app.route is an endpoint that returns the work within each statement?
# Yes
# So lets say we join our tables and we create different endpoints... 
# Joins can happen within the same endpoint
# You can call different tables
# Different endpoints can result in -- You can have...
# We can have multiple endpoints display different things
# You can have multiple tables on a page
# You can point to two different divs and have data coming from all sorts of places
# We have 4 tables, and we can join all of them -- Do we have to join them all to have them display on a chart?
# Depends on the chart
# So the bubble, scatter, and different axis should all be on the same table
# Melissa - So we're just going to have one endpoint with all of the tables joined...
# O - You can, from a design standpoint, you can query all the tables with a single function
# What data do we need to join to display, how do we need to join them, we'll do it in Flask
# Figure out what data we need for the structure, do we have a single API call, Figure out the query, merge them within Pandas or SQL (faster to do SQL)
