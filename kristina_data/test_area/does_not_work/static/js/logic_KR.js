

// import data with d3 and json and set dropdown menu to names array
const url = "/api/v1.0/data_2016";
d3.json(url).then(function(response) {
    let allData= response;

    var state_name = [];
    var state_abbrev = [];
    var rent_data = [];
    var tot_homeless = [];
    var avg_income = [];
    var avg_sale = [];

    allData.forEach(function(data) {

        state_name.push(data.State);
        state_abbrev.push(data.Code);
        rent_data.push(data.avg_rent);
        tot_homeless.push(data.Total_Homeless);
        avg_income.push(data.average_incomes);
        avg_sale.push(data.avg_sale_price);
        
    });  

    console.log(state_abbrev);
    console.log(rent_data);

    let choroData = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: state_abbrev,
        z: rent_data,
        text: state_name,
        colorscale: 'Viridis',
        colorbar: {
            title: '$ USD',
            thickness: 10
        },
        marker: {
            line:{
                color: 'rgb(200,200,200)',
                width: 1
            }
        }
    }];


    var layout = {
        title: '2016 Homeless Population',
        geo:{
            scope: 'usa'
        }
    };

    Plotly.newPlot("choropleth", choroData, layout);

  console.log(allData);
});



// function(choroData){

//       let choroData = [{
//           type: 'choropleth',
//           locationmode: 'USA-states',
//           locations: data.Codes,
//           z: unpack(rows, 'total exports'),
//           text: unpack(rows, 'state'),
//           colorscale: [
//               [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
//               [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
//               [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
//           ],
//           colorbar: {
//               title: 'Millions USD',
//               thickness: 0.2
//           },
//           marker: {
//               line:{
//                   color: 'rgb(255,255,255)',
//                   width: 2
//               }
//           }
//       }];


//       var layout = {
//           title: '2011 US Agriculture Exports by State',
//           geo:{
//               scope: 'usa',
//               showlakes: true,
//               lakecolor: 'rgb(255,255,255)'
//           }
//       };

//       Plotly.newPlot("myDiv", data, layout, {showLink: false});
// });
// read the json file in and set it to a variable. Then set that variable to the empty array "data"
// d3.json("samples.json").then((sample) => {
//     console.log(sample);
//     data = sample;

//     // 
//     data['states'].forEach(dropDownMenu => {
//         d3.select("#selDataset")
//         // option is the html element
//         .append("option")
//         .text(dropDownMenu)
//         .property("value", dropDownMenu)
//     });
