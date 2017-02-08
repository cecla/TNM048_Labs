    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    function kmeans(data, k) {
        var centPos = [], clusters = [];

        //STEP1 - take out k number of random positions in the dataset and use them as the first centroids
        for(var i = 0; i < k; i++){
            var pos = randomCentroidPos(0, data.length);

            while(centPos.indexOf(pos) != -1){ //check if the position is already taken
                pos = randomCentroidPos(0, data.length);
                console.log("created a new position");
            }

            centPos.push(pos);
            clusters.push(data[pos]); //insert the data object
        }
        
        //STEP2 - calculate the euclidean distance
        function step2(){
            //console.info("step2");
            //map every item in the dataset to the closest centroid
            data.map(function(d){
                var minDist = Infinity;
                var index = -1;
                
                clusters.forEach(function(c, i){
                    //c,d are objects
                    var temp = caculateEuclideanDist(d,c); //d=item from dataset, c=centroid

                    if(temp < minDist){
                        minDist = temp;
                        index = i;
                    }
                });
                d["i"] = index; //add/update cluster index for each item in dataset

                return d;
            });
        }
        step2();

        //STEP3 - calclate the mean value for each cluster and update centroid position
        function step3(){
            //console.info("step3");
            d3.nest().key(function(d){
                return d.i; //group function, group by cluster index
            }).entries(data).forEach(function(q,i){
                //q=array containg all items in a cluster, j=A,B,C,..
                for(var j = 0; j < _.values(q.values[0]).length - 1; j++){
                    clusters[i][d3.keys(clusters[i])[j]] = calculateMean(q.values, j);
                }
            });
        }
        step3();

        //STEP4 - calculate error
        var error;

        function step4(){
            //console.info("step4");
            error = 0;
            d3.nest().key(function(d){
                return d.i;
            }).entries(data).forEach(function(q){
                error += calculateError(q, clusters[q.key]);            
            });
            return error;
        }
        error = step4();

        //Taking step 2-4 again until condition is fulfilled
        var temp = Infinity;
        var tempCluster;
        var i = 0;

        while(i < 10){
            temp = error;
            tempCluster = clusters;

            step2();
            step3();
            error = step4();
            console.log(error);
            console.log(temp);

            console.log(i + " round");
            i++;
        }

        /*for(var i = 0; i < 20; i++){
            step2(); //assign each item to a cluster
            step3(); //calculate mean of each cluster
            error = step4(); //calculate error
        }*/
        step2();
        return clusters;
    };

    function randomCentroidPos(min, max){
        return Math.floor(Math.random() * ((max-1)-min) - min); //return a random position
    }

    function caculateEuclideanDist(a, b){
        return Math.sqrt(calculateDist(a, b));
    }

    function calculateDist(a, b){
        
        var q = _.values(a);
        var p = _.values(b);
        var sum = 0;

        var l = (d3.keys(a)[d3.keys(a).length-1] == "i") ? q.length-1 : q.length; //jump over var i
        
        for(var i = 0; i < l; i++){
            sum += Math.pow(p[i]-q[i],2);
        }

        return sum;
    }

    function calculateMean(cluster, index){
        return d3.mean(cluster.map(function(d){
            return _.values(d)[index];
        }));
    }

    function calculateError(cluster, centroid){
        var sum = 0;

        cluster.values.forEach(function(c){
            sum += caculateEuclideanDist(c, centroid);
        });

        return Math.pow(sum,2);
    }