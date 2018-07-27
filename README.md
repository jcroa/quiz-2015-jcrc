

Quiz Game
=========

    npm install
    npm install jshint
    npm install sqlite

Files
-----

Main app: ./bin/www

Config
------
Set environment variables:
 * PORT = 80 o 8443
 * DATABASE_URL = <see Config database>

Config database
---------------- 
Postgres:
  DATABASE_URL = postgres://rkjqotjtqcmjmn:SnJ09qa_ABejE1i1SjMBiqU24n@ec2-54-83-43-118.compute-1.amazonaws.com:5432/d578grmpsb38gc

SQLite:
  DATABASE_URL = sqlite://:@:/



Install SQLite on Windows:
--------------------------

Step 1 − Go to SQLite download page (https://www.sqlite.org/download.html), and download precompiled binaries from Windows section.

Step 2 − Download sqlite-shell-win32-*.zip and sqlite-dll-win32-*.zip zipped files.

Step 3 − Create a folder C:\>sqlite and unzip above two zipped files in this folder, which will give you sqlite3.def, sqlite3.dll and sqlite3.exe files.

Step 4 − Add C:\>sqlite in your PATH environment variable and finally go to the command prompt and issue sqlite3 command, which should display the following result.

    SQLite version 3.22.0 2018-01-22 18:45:57
    Enter ".help" for usage hints.


See also http://www.sqlitetutorial.net/download-install-sqlite/
