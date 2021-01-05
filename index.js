const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const requests = require('requests');
const url = require('url');
const homeFile = fs.readFileSync("home.html",'utf-8');
const port = process.env.PORT || 8000;
const [city,keyId] = ['Bengaluru','56fbb9d617b319e04d5cb9185aa97f03'];
const backgroundImg = {
    // night:'https://wallpapercave.com/wp/wp3284839.gif',
    // evening:'https://gifspro.com/wp-content/uploads/2018/06/Bantayan-Sunrise-05.gif',
    // afternoon:'https://i.gifer.com/MCyu.gif',
    morning:'https://thumbs.gfycat.com/DeadlyEmotionalArcherfish-max-1mb.gif'

}

var dayColor={
    morning:'rgba(106, 175, 204,0.8)',
    afternoon:'rgba(245, 238, 27,0.9)',
    evening:'rgba(237, 160, 7,0.9)',
    night:'rgba(89, 86, 77,0.8)',
}


function changeContainerBgColor(temp){
    const date = new Date();
    let dayTime = "Morning";
    const hour = date.getHours();
    let color = dayColor.morning;
    if(hour > 4 && hour<=11){
        color = dayColor.morning;
    }else if(hour > 11 && hour<=16){
        color = dayColor.afternoon;
    }else if(hour > 16 && hour<=19){
        color = dayColor.evening;
    }else{
        color = dayColor.night;
    }
    return color;
  }
const kelToCel = (temp)=>{
    const celcius = (temp-273.15);
    return celcius.toFixed(2);
}
const getLocalTime = (timestamp)=>{
    return (new Date(timestamp*1000).toLocaleTimeString());
}
const replaceVal = (htmlFile,data)=>{
    const background = `background:${changeContainerBgColor(kelToCel(data.main.temp))}`;
    const weatherImgSrc = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    temperature = htmlFile.replace("{%tempIcon%}",weatherImgSrc);
    temperature = temperature.replace("{%background%}",background);
    temperature = temperature.replace("{%tempCity%}",data.name);
    temperature = temperature.replace("{%tempCountry%}",data.sys.country);
    temperature = temperature.replace("{%temp%}",kelToCel(data.main.temp));
    temperature = temperature.replace("{%tempMin%}",kelToCel(data.main.temp_min));
    temperature = temperature.replace("{%tempMax%}",kelToCel(data.main.temp_max));
    temperature = temperature.replace("{%sunset%}",getLocalTime(data.sys.sunset));
    temperature = temperature.replace("{%sunrise%}",getLocalTime(data.sys.sunrise));
    temperature = temperature.replace("{%backgroundImg%}",`url('${backgroundImg.morning}');`);
    return temperature;
}
app.get("/",(req,res)=>{
        requests(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyId}`)
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
});
// const server = http.createServer((req,res)=>{
//     const link = url.parse(req.url);
//     if(link.pathname == "/"){
//         requests(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyId}`)
//         .on('data', function (chunk) {
//             const objData = JSON.parse(chunk);
//             const arrData = [objData];
//             const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
//             res.write(realTimeData);
//         })
//         .on('end', function (err) {
//             if (err) return console.log('connection closed due to errors', err);
//             res.end();
//         });
//     }
// })
// server.listen(port,"localhost");
app.listen(port,console.log(`Listening at port ${port}`));