const Home = (req,res) => {
    try{
        res.send({message : "Hii Welcome"});
    }catch(err){
        res.send({message : err})
    }
}

module.exports = Home;