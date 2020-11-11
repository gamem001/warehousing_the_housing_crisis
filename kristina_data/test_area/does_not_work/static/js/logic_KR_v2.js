
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
            title: '2016 Homeless Population',
            geo:{
                scope: 'usa'
            }
        };

        Plotly.newPlot("choropleth", choroData, layout);

    console.log(allData);
    });
};








// PLOT CODE STARTS HERE!

const url2 = "/api/v1.0/all_data";

d3.json(url2).then(function(response2) {
    let yearData= response2;
    let dataByYear = {'year':[],
                    'state_name2':[], 
                    'state_abbrev2':[],
                    'rent_data2':[],
                    'tot_homeless2':[],
                    'avg_income2':[],
                    'avg_sale2': []};

    yearData.forEach(function(fish) {
        dataByYear.state_name.push(fish.State);
        dataByYear.state_abbrev.push(fish.Code);
        dataByYear.rent_data.push(fish.avg_rent);
        dataByYear.tot_homeless.push(fish.Total_Homeless);
        dataByYear.avg_income.push(fish.average_incomes);
        dataByYear.avg_sale.push(fish.avg_sale_price);
});

console.log(dataByYear);
let state_names = dateByYear[state_name]

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
    let selectedId2 = d3.select('#selDataset').node().value;

    //let selectedObj = whatever[selectedId] 
    console.log(selectedId2);

    // build your plots
    //buildPlot(selectedId2);
};

// function buildMap(dog)

//     yearData.forEach(function(data) {

//         dataByYear.state_name.push(yearData.State);
//         dataByYear.state_abbrev.push(yearData.Code);
//         dataByYear.rent_data.push(yearData.avg_rent);
//         dataByYear.tot_homeless.push(yearData.Total_Homeless);
//         dataByYear.avg_income.push(yearData.average_incomes);
//         dataByYear.avg_sale.push(yearData.avg_sale_price);
        
//     });  

//         //console.log(state_abbrev);
//         //console.log(rent_data);
//         console.log(anything['rent_data']);
//         console.log(anything[cat]);

        
//         let choroData = [{
//             type: 'choropleth',
//             locationmode: 'USA-states',
//             locations: anything['state_abbrev'],
//             z: anything[cat],
//             text: anything['state_name'],
//             colorscale: 'Viridis',
//             colorbar: {
//                 title: '$ USD',
//                 thickness: 10
//             },
//             marker: {
//                 line:{
//                     color: 'rgb(200,200,200)',
//                     width: 1
//                 }
//             }
//         }];


//         var layout = {
//             title: '2016 Homeless Population',
//             geo:{
//                 scope: 'usa'
//             }
//         };

//         Plotly.newPlot("choropleth", choroData, layout);

//     console.log(allData);
//     });
// };


