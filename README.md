# typescript_task

task 01

You shall implement a very simple browser application in Javascript or Typescript that shall allow a user to check if an entered URL exists. The user shall be able to enter an URL and the URL must then be checked for valid format and if the format is correct it shall be sent to a server which provides the information if the URL exits and if it is a file or a folder. You shall not implement the server side, but just mock it on the client. The server call shall be asynchronous.
The check for the URL format and the existence check shall be triggered as the user is typing, but the existence check shall be throttled to avoid that too many server requests are done all the time.


To compile TS code

npm install
npx tsc 


commit comments
d9bc59634747caf7654b974705a6c117487588b4
    throttling work not as expected
    first valid url input works but server check does not happen when throttle done, even if input was updated

5d780b0c7e10adfab4963f21d3e31dc9ed191766
    actually not fixed problem
    fix works only once, so fo long inputs still works incorrectly