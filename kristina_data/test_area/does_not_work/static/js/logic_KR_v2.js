
let dropItems = ['Total Homeless','Average Income', 'Average Rental Price', 'Average House Price']
let whatever = {'Total Homeless':'tot_homeless','Average Income':'avg_income', 'Average Rental Price':'rent_data', 'Average House Price':'avg_sale'}

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
    let selectedId = d3.select('#selDataset').node().value;

    let selectedObj = whatever[selectedId] 
    console.log(selectedObj);

    // build your plots
    buildMap(selectedObj);
};

function buildMap(cat) {
// import fish with d3 and json and set dropdown menu to names array
    const url = "/api/v1.0/data_2016";
    d3.json(url).then(function(response) {
        let allData = response;
        let dataByYear = {'state_name':[], 
                        'state_abbrev':[],
                        'rent_data':[],
                        'tot_homeless':[],
                        'avg_income':[],
                        'avg_sale': []};

        allData.forEach(function(fish) {

            dataByYear.state_name.push(fish.State);
            dataByYear.state_abbrev.push(fish.Code);
            dataByYear.rent_data.push(fish.avg_rent);
            dataByYear.tot_homeless.push(fish.Total_Homeless);
            dataByYear.avg_income.push(fish.average_incomes);
            dataByYear.avg_sale.push(fish.avg_sale_price);
            
        });  

        //console.log(state_abbrev);
        //console.log(rent_data);
        console.log(dataByYear['rent_data']);
        console.log(dataByYear[cat]);

        
        let choroData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: dataByYear['state_abbrev'],
            z: dataByYear[cat],
            text: dataByYear['state_name'],
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
};








// PLOT CODE STARTS HERE!!!

let state_names = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']


state_names.forEach(dropDownMenu2 => {
    d3.select("#selState")
    // option is the html element
    .append("option")
    .text(dropDownMenu2)
    .property("value", dropDownMenu2)
});

// listens for when there is a change to the selDataset, when there is a change then it runs function updateDisplay
d3.selectAll('#selState').on("change", handleState); 


function handleState() {
    // use this to prevent the page from refreshing... may or may not be necessary.
    d3.event.preventDefault();

    // select the value from the dropdown
    let selectedId2 = d3.select('#selState').node().value;

    //let selectedObj = whatever[selectedId] 
    console.log(selectedId2);

    // build your plots
    buildPlot(selectedId2);
};

function buildPlot(dog) {
    // import fish with d3 and json and set dropdown menu to names array
        const url_2 = "/api/v1.0/all_data";
        d3.json(url_2).then(function(response_2) {

            let dataByYear = response_2;
            console.log(dataByYear);

            let avengers = dataByYear.filter(thor => thor.State === dog);
            console.log(avengers);

            let filteredByState = {'year':[],
                            'state_name':[], 
                            'state_abbrev':[],
                            'rent_data':[],
                            'tot_homeless':[],
                            'avg_income':[],
                            'avg_sale': []};
    
            avengers.forEach(function(fish) {
                filteredByState.year.push(fish.year);
                filteredByState.state_name.push(fish.State);
                filteredByState.state_abbrev.push(fish.Code);
                filteredByState.rent_data.push(fish.avg_rent);
                filteredByState.tot_homeless.push(fish.Total_Homeless);
                filteredByState.avg_income.push(fish.average_incomes);
                filteredByState.avg_sale.push(fish.avg_sale_price);
                
            });  
    
            
            console.log(filteredByState.year);
            //console.log(rent_data);
            //console.log(dataByYear['rent_data']);
 
            let trace_rent = {
            x: filteredByState.year,
            y: filteredByState.rent_data,
            name: 'Avg Rent Price',
            line:{color: '#20A187'},
            type: 'scatter'
            };

            let trace_sale = {
                x: filteredByState.year,
                y: filteredByState.avg_sale,
                name: 'Avg Home Sale Price',
                line:{color: '#440154'},
                xaxis: 'x2',
                yaxis: 'y2',
                type: 'scatter'
                };
            
            let trace_income = {
                x: filteredByState.year,
                y: filteredByState.avg_income,
                name: 'Avg Income',
                line:{color: '#7ED24F'},
                xaxis: 'x3',
                yaxis: 'y3',
                type: 'scatter'
              };

            let trace_homeless = {
                x: filteredByState.year,
                y: filteredByState.tot_homeless,
                name: '# of Homeless',
                line:{color: '#FDE725'},
                xaxis: 'x4',
                yaxis: 'y4',
                type: 'scatter'
              };  
            
            
            let ugh = [trace_rent, trace_income, trace_sale, trace_homeless];

            let layout = {
                title: `Data over time for ${dog}`,
                grid: {rows: 2, columns: 2, pattern: 'independent'},
                //yaxis:{title: '$'},
                //yaxis2:{title: '$'},
                //yaxis3:{title: '$'},
                //yaxis4:{title: '# of people'},
            };
              
            Plotly.newPlot('linechart', ugh, layout);
        });
    };