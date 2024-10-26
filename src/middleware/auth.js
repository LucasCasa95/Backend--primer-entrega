//Hacemos una funcion que verifique que seas admin: 

export function soloAdmin(req, res, next) {
    if(req.user.rol === "admin") {
        next(); 
    }else{
        res.status(403).send("Acceso denegado, este lugar es solo para admin"); 
    }
}

//Hacemos una funcion que verifique que seas user: 

export function soloUser(req, res, next) {
    if(req.user.rol === "user") {
        next(); 
    }else {
        res.status(403).send("Acceso denegado, este lugar es solo para usuarios comunachos"); 
    }
}