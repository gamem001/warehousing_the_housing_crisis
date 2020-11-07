import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Pet = create_classes(db)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        name = request.form["petName"]
        lat = request.form["petLat"]
        lon = request.form["petLon"]

        pet = Pet(name=name, lat=lat, lon=lon)
        db.session.add(pet)
        db.session.commit()
        return redirect("/", code=302)

    return render_template("form.html")


@app.route("/api/pals")
def pals():
    results = db.session.query(Pet.name, Pet.lat, Pet.lon).all()

    hover_text = [result[0] for result in results]
    lat = [result[1] for result in results]
    lon = [result[2] for result in results]

    pet_data = [{
        "type": "scattergeo",
        "locationmode": "USA-states",
        "lat": lat,
        "lon": lon,
        "text": hover_text,
        "hoverinfo": "text",
        "marker": {
            "size": 50,
            "line": {
                "color": "rgb(8,8,8)",
                "width": 1
            },
        }
    }]

    return jsonify(pet_data)


if __name__ == "__main__":
    app.run()

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
