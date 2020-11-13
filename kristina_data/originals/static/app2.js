let dropItems = ['Total Homeless','Average Income', 'Average Rental Price', 'Average House Price']
let whatever = {'Total Homeless':'tot_homeless','Average Income':'avg_income', 'Average Rental Price':'rent_data', 'Average House Price':'avg_sale'}
let selectId 
dropItems.forEach(dropDownMenu => {
    d3.select("#selDataset")
    // option is the html element
    .append("option")
    .text(dropDownMenu)
    .property("value", dropDownMenu)
});
// listens for when there is a change to the selDataset, when there is a change then it runs function updateDisplay
d3.selectAll('#selDataset').on("change", handleSubmit); 
function handleSubmit() {
    // use this to prevent the page from refreshing... may or may not be necessary.
    d3.event.preventDefault();
    // select the value from the dropdown
    selectedId = d3.select('#selDataset').node().value;
    let selectedObj = whatever[selectedId] 
    console.log(selectedObj);
    // build your plots
    buildMap(selectedObj);
};
function buildMap(cat) {
// import data with d3 and json and set dropdown menu to names array
    const url = "/api/v1.0/data_2016";
    d3.json(url).then(function(response) {
        let allData= response;
        let anything = {'state_name':[], 
                        'state_abbrev':[],
                        'rent_data':[],
                        'tot_homeless':[],
                        'avg_income':[],
                        'avg_sale': []};
        allData.forEach(function(data) {
            anything.state_name.push(data.State);
            anything.state_abbrev.push(data.Code);
            anything.rent_data.push(data.avg_rent);
            anything.tot_homeless.push(data.Total_Homeless);
            anything.avg_income.push(data.average_incomes);
            anything.avg_sale.push(data.avg_sale_price);
        });  
        //console.log(state_abbrev);
        //console.log(rent_data);
        console.log(anything['rent_data']);
        console.log(anything[cat]);
        let choroData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: anything['state_abbrev'],
            z: anything[cat],
            text: anything['state_name'],
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
            title: `2016 ${selectedId}`,
            geo:{
                scope: 'usa'
            }
        };
        Plotly.newPlot("choropleth", choroData, layout);
        var update = {
            width: 900,  // or any new width
            height: 600  // " "
          };
          
        Plotly.relayout('choropleth', update);
    console.log(allData);
    });
};