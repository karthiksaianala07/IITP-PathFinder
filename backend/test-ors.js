// running native fetch in node 25

async function test() {
    const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJiNzU3ZTNjOTE0NTQwM2U4ZmZmNDI3MjdlZGY4YWM0IiwiaCI6Im11cm11cjY0In0=";
    const body = {
        coordinates: [[88.3639, 22.5726], [92.8368, 26.6853]], // Kolkata to Tezpur (crosses Bangladesh normally)
        options: {
            avoid_borders: "all"
        }
    };
    
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
            'Authorization': ORS_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    console.log(JSON.stringify(json).substring(0, 500));
}

test();
