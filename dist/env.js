class Env {
  constructor(){
    this.destinationSpreadsheetId = PropertiesService.getScriptProperties().getProperty('DESTINATION_SPREADSHEET_ID');

    this.parentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
    this.parentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
    this.destinationSpreadsheetId = PropertiesService.getScriptProperties().getProperty('DESTINATION_SPREADSHEET_ID');
    this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
    this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');

  }
}