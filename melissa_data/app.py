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
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'housing_data.db
# reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(engine, reflect=True)
# # Save references to each table
# rent_data = Base.classes.rental_pricing
# # Station = Base.classes.station
# # Create our session (link) from Python to the DB
# session = Session(engine)
# Flask Setup
#################################################
app = Flask(__name__)
#################################################
# Flask Routes
#################################################

## join tables in here! 
## hit this endpoint with js
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
    return (
        f"Welcome to the Warehouse of Housing Data API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/all_data<br/>"
        f"/api/v1.0/data_2016<br/>"
    )

@app.route("/api/v1.0/all_data")
## need to join basic data here
## need to filter all data on year: 2016
## need to total homelessness per state for year 2016
## need to join all data on state & year
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
    # precip_dictionary = {date: prcp for prcp, date in result}
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

# @app.route("/api/v1.0/tobs")
# def tobs():
#     # Create session (link) from Python to the DB
#     session = Session(engine)

#     # Query for beginning and ending dates for the last year of data.
#     last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first().date
#     query_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)

#     # Query for temps and dates from the most active station for the last year of data.
#     tobs_info = session.query(Measurement.tobs, Measurement.date).\
#     filter(Measurement.station == 'USC00519281').\
#     filter(Measurement.date >= query_date).\
#     filter(Measurement.date <= last_date).\
#     order_by(Measurement.date).all()
#     tobs = list(np.ravel(tobs_info))
#     return jsonify(tobs)

#     session.close()


# @app.route("/api/v1.0/temp/<start>")
# @app.route("/api/v1.0/temp/<start>/<end>")
# def stats(start=None, end=None):

#     session = Session(engine)

#     """Return TMIN, TAVG, TMAX."""
#     # Select statement
#     sel = [func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)]
#     if end is None:
#         # calculate TMIN, TAVG, TMAX for dates greater than start
#         results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
#             filter(Measurement.date >= start).all()
#         # Unravel results into a 1D array and convert to a list
#         temps = list(np.ravel(results))
#         return jsonify(temps)
#     # calculate TMIN, TAVG, TMAX with start and stop
#     results = session.query(*sel).\
#         filter(Measurement.date >= start).\
#         filter(Measurement.date <= end).all()
#     # Unravel results into a 1D array and convert to a list
#     temps = list(np.ravel(results))
#     return jsonify(temps)
    
#     session.close()


if __name__ == '__main__':
    app.run()

