    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    function kmeans(data, k) {
        var centPos = [], clusters = [];
        console.log(data.features.length);

        //STEP1
        for(var i = 0; i < k; i++){
            var pos = randomCentroidPos(0, data.features.length);

            while(centPos.indexOf(pos) != -1){
                pos = randomCentroidPos(0, data.features.length);
                console.log("created a new position");
            }

            centPos.push(pos);
            clusters.push(data.features[pos]);
        }
        console.log(clusters[0].geometry.coordinates);
        
        //STEP2
        function step2(){
            //console.info("step2");
            var indexData = data.features.map(function(d){
                var minDist = Infinity;
                var index = -1;
                
                clusters.forEach(function(c, i){
                    //c,d are objects
                    var temp = caculateEuclideanDist(d.geometry.coordinates,c.geometry.coordinates);

                    if(temp < minDist){
                        minDist = temp;
                        index = i;
                    }
                });
                d.properties["i"] = index;
                return d;
            });
            //console.log(indexData);
        }
        step2();

        
        //STEP3
        //sort data by cluster index
        function step3(){
            //console.info("step3");
            d3.nest().key(function(d){
                return d.properties.i;
            }).entries(data.features).forEach(function(q,i){
                //console.log(clusters);
                for(var j = 0; j < 2; j++){
                    clusters[i].geometry.coordinates[j] = calculateMean(q.values, j);
                    //console.log(clusters[i].geometry.coordinates[j]);
                }
            });
        }
        step3();

        //STEP4
        var error;

        function step4(){
            //console.info("step4");
            error = 0;
            d3.nest().key(function(d){
                return d.properties.i;
            }).entries(data.features).forEach(function(q){
                //console.log(q);
                error += calculateError(q, clusters[q.key]);            
            });
            return error;
        }
        error = step4();

        var temp = Infinity;
        var tempCluster;
        var i = 0;

        while(i < 20){
            temp = error;
            tempCluster = clusters;

            step2();
            step3();
            error = step4();
            //console.log(error);
            //console.log(temp);

            //console.log(i + " round");
            i++;
        }

        /*for(var i = 0; i < 20; i++){
            step2(); //assign each item to a cluster
            step3(); //calculate mean of each cluster
            error = step4(); //calculate error
        }*/
        step2();
        console.log(data);
        return data;
    };

    function randomCentroidPos(min, max){
        return Math.floor(Math.random() * ((max-1)-min) - min);
    }

    function caculateEuclideanDist(a, b){
        return Math.sqrt(calculateDist(a, b));
    }

    function calculateDist(a, b){
        
        var q = _.values(a);
        var p = _.values(b);
        var sum = 0;

        var l = (d3.keys(a)[d3.keys(a).length-1] == "i") ? q.length-1 : q.length;
        
        for(var i = 0; i < l; i++){
            sum += Math.pow(p[i]-q[i],2);
        }

        return sum;
    }

    function calculateMean(cluster, index){
        //console.log(_.values(cluster[0]).length);
        //console.log(index);
        return d3.mean(cluster.map(function(d){
            return d.geometry.coordinates[index];
        }));
    }

    function calculateError(cluster, centroid){
        var sum = 0;

        cluster.values.forEach(function(c){
            sum += caculateEuclideanDist(c.geometry.coordinates, centroid.geometry.coordinates);
        });

        return Math.pow(sum,2);
    }