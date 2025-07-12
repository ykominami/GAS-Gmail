class PairLabel {
  static getOrCreateLabel(labelName){
    let label = GmailApp.getUserLabelByName(labelName) 
    if (label === null){
      label = GmailApp.createLabel(labelName)
    }
    return label
  }
  constructor(name){
    this.targetLabelName = name
    this.endLabelName = this.makeEndLabelName(name)
    this.targetLabel = PairLabel.getOrCreateLabel(this.targetLabelName) 
    this.endLabel = PairLabel.getOrCreateLabel(this.endLabelName) 
  }
  makeEndLabelName(name){
    return name + "_"
  }
}

function getOrCreateLabel(labelName){
  let label = GmailApp.getUserLabelByName(labelName) 
  if (label === null){
    label = GmailApp.createLabel(labelName)
  }
  return label
}
