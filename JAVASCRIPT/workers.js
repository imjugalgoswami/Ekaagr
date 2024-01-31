let startInterval;
onmessage = function(e){
    let data = e.data;
    if(data.option === "start"){
        startInterval = setInterval(()=>{
            if(data.msec>=99){
                data.msec=0;
                if(data.sec>=59){
                    data.sec=0;
                    if(data.min>=59){
                        data.hour += 1;
                        data.min=0;
                    }else{
                        data.min += 1;
                    }
                }else{
                    data.sec += 1;
                }
            }else{
                data.msec += 1;
            }

            this.postMessage({
                "startInterval":startInterval,
                "msec":data.msec,
                "sec":data.sec,
                "min":data.min,
                "hour":data.hour,
            });
        },10);
    }else if(data.option === "stop"){
        clearInterval(startInterval);
    }
}