# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.4] - 2023-08-07

### Fixed
- A typo in DOL.js that didn't allow 2014 to be patched

## [2.1.3] - 2023-07-23

### Fixed
- Some WBFS/ISO files do not have UPDATE partition, and WIT extracts the DATA directly into the tmp folder. It was causing an issue for the code to find the DOL file.

## [2.1.2] - 2023-07-23

### Fixed
- Issue with Windows where DLL files for WIT werent copied over the TMP folder, causing WIT to throw a DLL error if not installed locally on device.

## [2.1.1] - 2023-07-18

### Removed
- Unused WIT executables

## [2.1.0] - 2023-07-18

### Fixed
- An issue where **pkg** failed to access WIT executables, now all executables are kept in memory temporarily.
- Logger no longer logs to file when ran with **pkg**

### Removed
- Unnecessary WIT tools

## [2.0.0] - 2023-07-18

### Added
- Patcher can now patch WBFS and ISO files directly, you no longer need to go through all the mess.

## [1.2.2] - 2023-07-12

### Fixed
- Fixed 2014

## [1.2.1] - 2023-06-21

### Added
- Rooms as variables

### Updated
- JD15 strings and room names

## [1.2.0] - 2023-06-20

### Updated
- JD15 strings and room names

## [1.1.0] - 2023-06-20

### Added
- `.env` file to switch between logging levels

### Updated
- JMCS subdomain

### Fixed
- NULL space filler

## [1.0.0] - 2023-06-18

Initial release