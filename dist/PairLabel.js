class PairLabel {
  constructor(name){
    this.targetLabelName = name
    this.endLabelName = this.makeEndLabelName(name)
    this.targetLabel = get_or_create_label(this.targetLabelName) 
    this.endLabel = get_or_create_label(this.endLabelName) 
  }
  makeEndLabelName(name){
    return name + "_"
  }
}

function get_or_create_label(labelName){
  let label = GmailApp.getUserLabelByName(labelName) 
  if (label === null){
    label = GmailApp.createLabel(labelName)
  }
  return label
}
