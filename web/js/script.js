async function searchDevs() {
    const req = await fetch('http://localhost:3001/devs')
    const res = await req.json()
    console.log(res)
}

searchDevs();