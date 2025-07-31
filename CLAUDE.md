# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Apps Script (GAS) project for automated Gmail management, email search, and classification. The application searches Gmail messages based on configured criteria, stores results in Google Spreadsheets, and applies labels for organization.

## Build and Deployment

Since this is a Google Apps Script project, development and deployment are done through the Google Apps Script platform:

- **Deploy**: Use the Google Apps Script editor at script.google.com to deploy the functions
- **TypeScript Native Preview**: The project uses `@typescript/native-preview` version 7.0.0-dev.20250715.1
- **No traditional build process**: Files in `dist/` are the transpiled JavaScript output from TypeScript sources

## Core Architecture

### Main Entry Points
- `top.js`: Main orchestration class with three execution modes:
  - `start()` - Basic Gmail search and storage (`Top.execute()`)
  - `start2()` - Email analysis and categorization (`Top.execute2()`) 
  - `start3()` - Thread collection and analysis (`Top.execute3()`)

### Key Components

**Configuration Layer**:
- `Config` class: Manages configuration types (CONFIG_INFO, CONFIG_INFO1, CONFIG_INFO2, etc.) and spreadsheet settings
- `ConfigSpreadsheet`: Handles configuration spreadsheet operations
- `ConfigTable`: Manages configuration data structure

**Gmail Processing Layer**:
- `Gmail` class: Core Gmail operations controller
- `EmailFetcherAndStorer`: Handles email search and storage with different search strategies
- `GmailSearch`: Implements search and classification logic

**Data Storage Layer**:
- `RecordSpreadsheet`: Manages record storage spreadsheet operations
- `RegisteredEmail`/`RegisteredEmailList`: Handles registered email data
- `TargetedEmail`/`TargetedEmailList`: Manages targeted email configurations

**Search and Query System**:
- `QueryInfo`/`Queryresult`: Query definition and result management
- `DateRangeQueryList`: Handles date-based query operations
- `PairLabel`: Manages Gmail label operations

### External Dependencies

The project uses several custom GAS libraries:
- **YKLiba**: Base utilities and array operations
- **YKLibb**: Spreadsheet operations (Gssx utilities)  
- **YKLiblog**: Logging framework with different log levels
- **TestGAS**: Testing utilities
- **GASUnit**: Unit testing framework

## Development Workflow

1. **Configuration Setup**: Configure spreadsheet IDs and properties through Google Apps Script's Properties Service
2. **Local Development**: TypeScript files are developed locally and transpiled to the `dist/` directory
3. **Testing**: Use GASUnit framework for unit testing
4. **Deployment**: Deploy through Google Apps Script editor

## Key Configuration

The application requires several Google Apps Script properties to be set:
- `CONFIG_SPREADSHEET_ID`: Main configuration spreadsheet
- `CONFIG_INFO_SPREADSHEET_ID`: Configuration info spreadsheet  
- `DOC_PARENT_FOLDER_ID`: Document storage folder
- `CELL_CONTENT_LIMIT`: Content processing limit

## Directory Structure

- `gas-gmail/dist/`: Transpiled JavaScript files organized by functionality
  - `1/`: Email registration and targeting components
  - `2/`: Core Gmail processing, search, and query components
  - Root level: Configuration, utilities, and main orchestration files
- `gas-gmail/appsscript.json`: GAS project configuration with library dependencies
- `gas-gmail/package.json`: Node.js dependencies for development