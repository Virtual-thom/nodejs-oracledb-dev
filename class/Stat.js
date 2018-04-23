import oracledb from 'oracledb'
import dbconfig from '../config/dbconfig'


export default class Stat {
  
  constructor(req){
    //console.log(req.body, req.query, req.params)
    this.table = "TOP100_STATS_TRT"
    this.maxRows = 1
    this.columns = ['vtdomaine', 'vtenvname', 'vtapplname', 'vtjobname', 'vtstatus', 'vtbegin', 'vtend', 'vterrmess', 'vtexpdatevalue', 'vtcomment']
    this.columnsExploded = this.columns.join(",")
    this.columns.forEach((column) => { 
      this[column] = req.body[column]
    })
    this.orderby = "ORDER BY VTEND, " + this.columnsExploded + " DESC"
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
          `SELECT ${this.columnsExploded}
          FROM ${this.table}
          ${this.where}
          ${this.orderby}
          `,
          this.bindings,
          { maxRows: this.maxRows}
        )
        .then(result => {
          resolve(result)
          conn.close()
        })
        .catch(error => {
          reject(error)
          conn.close()
        })
      })
      .catch(error => {
        reject(error)
      })
    }else{
      reject({"error": "Vérifier la request query " + this.columnsExploded})
    }
    
  }
  
}
