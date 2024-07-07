function fetchData(callback) {
  setTimeout(() => {
    const data = "data fetched s";
    callback(data);
    
  }, 1000);
}

function processData(d) {
    console.log("Processing", d);
    console.log("happens");
}

fetchData(processData);
