// import data with d3 and json and set dropdown menu to names array
const url = "/api/v1.0/data_2016";
d3.json(url).then(function(response) {
    let allData= response;

    allData.forEach(function(data) {
        data.Total_Homeless = +data.Total_Homeless;
        data.average_incomes = +data.average_incomes;
        data.avg_rent = +data.avg_rent;
        data.avg_sale_price = +data.avg_sale_price;
    });
    console.log(allData);
    console.log('hello world');

// read the json file in and set it to a variable. Then set that variable to the empty array "data"
d3.json("samples.json").then((sample) => {
    console.log(sample);
    data = sample;

    // 
    data['states'].forEach(dropDownMenu => {
        d3.select("#selDataset")
        // option is the html element
        .append("option")
        .text(dropDownMenu)
        .property("value", dropDownMenu)
    });
});