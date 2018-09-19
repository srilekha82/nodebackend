# idviceBackend
  Backend for the IdviceApp
 
 1. prerequisite - can be run with docker.
 for running on local - sh build.sh local 
 
 2. For running on the QA and Prod will be set up on Azure.
  
  User can check the swagger docs for REST api details
  at localhost:port/api-docs
  
  Authentication needs to be passed to the Authorization Header.
  Authorization = Bearer <id_token from Azure>
