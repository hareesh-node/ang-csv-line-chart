angular.module('myApp', ['ngFileUpload', 'chart.js'])
.controller('uploadCsvCtrl',["$scope", "$http", function ($scope, $http) {
    let vm = this;
    vm.showLineChart = false;
    vm.seriesData = {
        json: {},
        sValue: ""
    };
    
    // select file
    vm.selectFile = function (file) {
        vm.selectedFile = file;
    };
    
    vm.displayLineChart = function () {
        
        // prepare dynamic json
        vm.labels = [];
        // prepare labels
        Object.keys(vm.seriesData.json).forEach(function (value) {
            vm.seriesData.json[value].forEach((val) => {
                if (vm.labels.indexOf(val.year) === -1) {
                    vm.labels.push(val.year);
                };
            });
        });
        vm.labels.sort((a,b) => a-b);
        // prepare series data
        vm.series = Object.keys(vm.seriesData.json);
        // prepare data
        vm.data = [];
        Object.keys(vm.seriesData.json).forEach(function (value) {
            
            let sData = [];
            
            vm.labels.forEach(function(label) {
                
                let sVal = vm.seriesData.json[value].find((series) => series.year === label) || { score: 0 };
                
                sData.push(sVal.score);
                
            });
            
            vm.data.push(sData);
            
        });
        
        

        // doesn't work 
        vm.colours = [{
            fillColor: "rgba(255,0,0,1)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,0.8)"
        }];
    
        $scope.$apply(function() {
            vm.showLineChart = true;
        });
        
    };
    
    //send json to server
    vm.sendJsonToServer = function() {
        console.log("send to server call via http proptocol");
//        $http.post("", { json: vm.seriesData.json }, headers).then(function(response) {
//            
//        }).catch(function(err) {
//            
//        });
    };
    
    
    // upload cs file
    vm.upload = function () {
        let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (!vm.selectedFile) {
            alert("Select csv file");
        }
        if (regex.test(vm.selectedFile.name.toLowerCase())) {
            if (typeof (FileReader) !== "undefined") {
                let reader = new FileReader();
                reader.onload = function (e) {
                    let rows = e.target.result.split("\n");
                    for (let i = 0; i < rows.length; i++) {
                        let cells = rows[i].split(",");
                        
                        cells.reduce(function(series, val, i) {
                            if (i === 0) {
                                series.sValue = val;
                                series.json[val] = [];
                            } else {
                                val = val.split("|");
                                series.json[series.sValue].push({
                                    year: val[0],
                                    score: val[1]
                                });
                            }
                            return series;
                            
                        }, vm.seriesData);
                        
                        // sort year
                        vm.seriesData.json[vm.seriesData.sValue].sort((a,b) => a.year- b.year);
                        
                    }
                    
                    // display line chart
                    vm.displayLineChart();
                    
                    // to call the server
                    vm.sendJsonToServer();
                };
                reader.readAsText(vm.selectedFile);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    };
    
}]);
