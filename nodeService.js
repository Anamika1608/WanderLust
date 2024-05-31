const Service = require("node-windows").Service;

const svc = new Service({
    name : "nodeBasicServer",
    description : "This is our desc",
    script : "C:\\Users\\monik\\OneDrive\\Desktop\\CODING\\WanderLust\\app.js"
})

svc.on("install",function(){
    svc.start()
})

svc.install();