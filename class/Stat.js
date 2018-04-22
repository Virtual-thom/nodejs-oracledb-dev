import oracledb from 'oracledb'
import dbconfig from '../config/dbconfig'


export default class Stat {
  
  constructor(req){
    console.log(req.body, req.query, req.params)
    this.table = "STATS"
    this.columns = ['env', 'app', 'job']
    this.columns.forEach((column) => { 
      this[column] = req.query[column]
    })
    this.orderby = "ORDER BY " + this.columns.join(",") + " DESC"
  }

  _buildWhere(){
    this.bindings = {}
    this.where = ""
    let whereConstruct = []

    let elements = 
    this.columns.forEach((element) => { 
      
      // si l'élement existe, on le bind et on ajoute à la requête where
      if(this[element] !== undefined){

        // Bindings
        this.bindings[element] = { "val": this[element]}

        // Where
        whereConstruct.push(`${element} = :${element}`)
      }
    })

    if(whereConstruct.length > 0){
      this.where = "WHERE " + whereConstruct.join(" AND ")
    }     
  }

  // Doit être appelée avec une Promise
  /*
    let p1 = new Promise((resolve, reject) => jobStat.getLast(resolve, reject))
    p1.then(result => console.log(result)) 
  */
  getLast(resolve, reject){
    this._buildWhere()

    // On veut un filtre à la construction
    if(this.where != ""){
      oracledb.getConnection(dbconfig)
      .then(conn => {
        conn.execute(
          `SELECT * FROM ${this.table}
          ${this.where}
          ${this.orderby}
          `,
          this.bindings
        ).then(result => {
          resolve(result)
        })
      })
      .catch(error => {
        reject(error)
      })
    }else{
      reject({"error": "Vérifier la request query env, app, job"})
    }
    
  }
  
}
