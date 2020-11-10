import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
import requests
import numpy as np
import sqlite3
from flask_cors import cross_origin, CORS

##delect , func from import create_engine
#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///housing_data.db")
#################################################
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
#################################################
# Flask Routes
#################################################

rent_2016 = pd.read_sql('SELECT * FROM rental_pricing WHERE year = 2016', con=engine)
homeless_2016 = pd.read_sql('SELECT * FROM homelessness WHERE year = 2016', con=engine)
states = pd.read_sql('SELECT * FROM states', con=engine) 
avg_income_2016 = pd.read_sql('SELECT * FROM avg_income_data WHERE Year = 2016', con=engine)
avg_home_2016 = pd.read_sql('SELECT * FROM avg_home_cost WHERE Year = 2016', con=engine)

rent_data = pd.read_sql('SELECT * FROM rental_pricing', con=engine)
homeless_data = pd.read_sql('SELECT * FROM homelessness', con=engine)
income_data = pd.read_sql('SELECT * FROM avg_income_data', con=engine)
home_price_data = pd.read_sql('SELECT * FROM avg_home_cost', con=engine)

@app.route("/")
def welcome():
    return render_template("index.html")
    # return (
    #     f"Welcome to the Warehouse of Housing Data API!<br/>"
    #     f"Available Routes:<br/>"
    #     f"/api/v1.0/all_data<br/>"
    #     f"/api/v1.0/data_2016<br/>"
    # )
# need to join basic data here
# need to filter all data on year: 2016
# need to total homelessness per state for year 2016
# # need to join all data on state & year
# def welcome():
#     data_return_1 = all_data()
#     return render_template("index.html", data_1 = data_return_1)


@app.route("/api/v1.0/all_data")
@cross_origin()

def all_data():
    session = Session(engine)
    
    rent_data.state = rent_data.state.str.strip()
    rent_data_cedit = rent_data.rename(columns={'state':'State'})

    homeless_data_cedit = homeless_data.rename(columns={'state':'Code'})
    homeless_data_filtered = homeless_data_cedit[['year', 'Code','Total_Homeless']]
    homeless_data_merge = homeless_data_filtered.groupby(['Code','year'], as_index = False).sum(['Total_Homeless'])
    
    income_data_cedit = income_data.rename(columns={'Year':'year'})
    home_price_data_cedit = home_price_data.rename(columns={'State':'Code','Year':'year'})
    
    all_states_rent = pd.merge(states, rent_data_cedit[['State','year','avg_rent']], on = 'State', how = 'left')
    all_states_rent_homeless = pd.merge(all_states_rent, homeless_data_merge[['Code','year','Total_Homeless']], on = ['year','Code'], how = 'left')
    all_states_rent_homeless_home = pd.merge(all_states_rent_homeless, home_price_data_cedit[['Code','year','avg_sale_price']], on = ['year','Code'], how = 'left')
    all_states_rent_homeless_home_income = pd.merge(all_states_rent_homeless_home, income_data_cedit[['State','year','average_incomes']], on = ['year','State'], how = 'left')
    temp_3 = all_states_rent_homeless_home_income.dropna()
    temp_4 = temp_3.drop(['Abbrev'], axis=1)

    all_data = temp_4.to_dict()
    return jsonify(all_data)

    session.close()


@app.route("/api/v1.0/data_2016")
def data_2016():
    # Create session (link) from Python to the DB
    session = Session(engine)

    rent_2016.state = rent_2016.state.str.strip()
    rent_2016_cedit = rent_2016.rename(columns={'state':'State'})

    homeless_2016_cedit = homeless_2016.rename(columns={'state':'Code'})
    homeless_2016_filtered = homeless_2016_cedit[['year', 'Code','Total_Homeless']]
    homeless_2016_merge = homeless_2016_filtered.groupby(['Code'], as_index = False).sum(['Total_Homeless'])

    avg_home_2016_cedit = avg_home_2016.rename(columns={'State':'Code'})

    states_rent = pd.merge(states, rent_2016_cedit[['State','avg_rent']], on = 'State', how = 'left')
    states_rent_homeless = pd.merge(states_rent, homeless_2016_merge[['Code','Total_Homeless']], on = 'Code', how = 'left')
    states_rent_homeless_income = pd.merge(states_rent_homeless, avg_income_2016[['State','average_incomes']], on = 'State', how = 'left')
    states_rent_homeless_income_home = pd.merge(states_rent_homeless_income, avg_home_2016_cedit[['Code','avg_sale_price']], on = 'Code', how = 'left')
    temp = states_rent_homeless_income_home.drop(['Abbrev'], axis=1)
    temp_2 = temp.dropna()

    all_data_2016 = temp_2.to_dict()

    return jsonify(all_data_2016)

    session.close()

if __name__ == '__main__':
    app.run()

