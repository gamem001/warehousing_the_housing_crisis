const url = "/api/v1.0/data_2016";
d3.json(url).then(function(response) {
    let allData= response;
    var state_abbrev = [];
    var rent_data = [];
    var tot_homeless = [];
    var avg_income = [];
    var avg_sale = [];
    allData.forEach(function(data) {
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
        z: tot_homeless,
        text: state_abbrev,
        colorscale: 'YlGnBu',
        colorbar: {
            title: '# of people',
            thickness: 0.4
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
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