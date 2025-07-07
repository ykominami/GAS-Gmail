class Xyz {
  constructor( name ) {
    this.name = name
    this.targetedEmailConfigTableDef = this.makeTargetedEmailConfigTableDef()
    this.targetedEmailIdsConfigTableDef = this.makeTargetedEmailIdsConfigTableDef()
  }
  getName(){
    return this.name
  }
  getTargetedEmailConfigTableDef(){
    return this.targetedEmailConfigTableDef
  }
  getTargetedEmailIdsConfigTableDef(){
    return this.targetedEmailIdsConfigTableDef
  }
  makeTargetedEmailConfigTableDef(){
    const nameOfId = "id"
    this.header = [nameOfId, "from", "subject", "dateStr", "plainBody"]
    const tableDef = new Xyz.TableDef(this.header, nameOfId)
    return tableDef
  }
  makeTargetedEmailIdsConfigTableDef(){
    const nameOfId = "name"
    this.header = [nameOfId]
    const tableDef = new Xyz.TableDef(this.header, nameOfId)
    return tableDef
  }
}
Xyz.TableDef = class {
  constructor( header, indefOfId, nameOfId ){
    this.header = header
    this.nameOfId = nameOfId
    this.indexOfId = header.indexOf(nameOfId)    
  }
}

function test_xyz_abc(){
  const xyz = new Xyz('xyz')
  xyz.getTargetedEmailConfigTableDef()
  xyz.getTargetedEmailIdsConfigTableDef()
}
