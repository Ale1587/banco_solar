const http = require('http')
const fs = require('fs')
const url = require('url')
const { insert, queryBbdd, updateUser, deleteUser } = require('./query')
const { insertTransaccion, getTransferencias } = require('./transaction')


http.createServer( async (req, res) =>{

    // servidor del sitio
    if(req.url == '/' && req.method == 'GET'){
        res.setHeader('content-type', 'text/html')
        const html = fs.readFileSync('index.html', 'utf-8')
        res.end(html)
    }

    // recibe el payload de los datos de la vista cliente y ingresalos a la bbdd - post  -- ruta /usuario

    if(req.url == '/usuario' && req.method == 'POST'){
        let body = '';

        req.on('data', (chunk) =>{
            body += chunk;
        });

        req.on('end', async () =>{
            const data = Object.values(JSON.parse(body));
            const respuesta = await insert(data);

            res.statusCode = 201;
            res.end(JSON.stringify(respuesta))
        })
    }

    // devuelve el json a cliente – get -- ruta /usuarios 

    if(req.url =='/usuarios' && req.method == 'GET'){
        res.setHeader('content-type', 'application/json')
        const data = await queryBbdd();
        res.statusCode = 200;
        res.end(JSON.stringify(data))
    }
    
    
    // update -- put --- /usuario?id=
    if(req.url.startsWith('/usuario?id=') && req.method == 'PUT'){
        const { id } = url.parse(req.url, true).query;
        console.log(id);
        let body = '';

        req.on('data', (chunk) =>{
            body += chunk
        })

        req.on('end', async ()=>{
            const data = Object.values(JSON.parse(body));
            const respuesta = await updateUser(data, id);
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta))
        })


    }

    // delete -- delete -- /usuario?id=
    if(req.url.startsWith('/usuario?id=') && req.method == 'DELETE'){
        const { id } = url.parse(req.url, true).query;
        const respuesta = await deleteUser(id);
        res.statusCode = 200;
        res.end(JSON.stringify(respuesta))
    }

    // transferencia recibe datos de la vista usuario -- post -- /transferencia
    if(req.url == '/transferencia' && req.method == 'POST'){
        let body = '';

        req.on('data', (chunk) =>{
            body += chunk;
        })

        req.on('end', async () =>{
            const data = Object.values(JSON.parse(body))
           const emisor =data[0]
           const receptor =data[1]
           const monto = parseInt(data[2])

           const respuesta = await insertTransaccion(emisor, receptor, monto)

            res.statusCode = 200;
            res.end(JSON.stringify(respuesta))
        })
    }

    // transferencia envía datos a la vista usurio --get /transferencias

    if(req.url =='/transferencias' && req.method == 'GET'){
        res.setHeader('content-type', 'application/json')
        const data = await getTransferencias();
        res.statusCode = 200;
         res.end(JSON.stringify(data))
    } 
    


})
.listen(3000, () => console.log('Server on'))