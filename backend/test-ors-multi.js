// native fetch in node 25
async function test() {
    const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJiNzU3ZTNjOTE0NTQwM2U4ZmZmNDI3MjdlZGY4YWM0IiwiaCI6Im11cm11cjY0In0=";
    
    // Delhi to Patna
    const startCoords = [77.2090, 28.6139]; 
    const endCoords = [84.8511, 25.5358];
    const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

    const prefs = ["fastest", "shortest", "recommended"];
    
    for (const pref of prefs) {
        const body = {
            coordinates: [startCoords, endCoords],
            preference: pref,
            radiuses: [-1, -1],
            options: { avoid_borders: "all" }
        };
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': ORS_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if (data.error) {
            console.log(pref, "Error:", data.error.message);
        } else {
            console.log(pref, "Distance:", data.features[0].properties.summary.distance, "Duration:", data.features[0].properties.summary.duration);
        }
    }
}
test();
