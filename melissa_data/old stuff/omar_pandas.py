import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine
engine = create_engine("sqlite:///housing_data.db")

rent_2016 = pd.read_sql('SELECT * FROM rental_pricing WHERE year = 2016', con=engine)
homeless_2016 = pd.read_sql('SELECT * FROM homelessness WHERE year = 2016', con=engine)
states = pd.read_sql('SELECT * FROM states', con=engine) 
avg_income_2016 = pd.read_sql('SELECT * FROM avg_income_data WHERE Year = 2016', con=engine)
avg_home_2016 = pd.read_sql('SELECT * FROM avg_home_cost WHERE Year = 2016', con=engine)

rent_data = pd.read_sql('SELECT * FROM rental_pricing', con=engine)
homeless_data = pd.read_sql('SELECT * FROM homelessness', con=engine)
income_data = pd.read_sql('SELECT * FROM avg_income_data', con=engine)
home_price_data = pd.read_sql('SELECT * FROM avg_home_cost', con=engine)


rent_data.state = rent_data.state.str.strip()
rent_data_cedit = rent_data.rename(columns={'state':'State'})

homeless_data_cedit = homeless_data.rename(columns={'state':'Code'})
homeless_data_filtered = homeless_data_cedit[['year', 'Code','Total_Homeless']]
homeless_data_merge = homeless_data_filtered.groupby(['Code','year'], as_index = False).sum(['Total_Homeless'])
print(homeless_data_merge.head())